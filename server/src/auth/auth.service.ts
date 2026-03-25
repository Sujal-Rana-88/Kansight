import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Session } from './entities/session.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { TokenService } from './token.service';

type SignupDto = { email?: string; password?: string };
type LoginDto = { email?: string; password?: string };
type RefreshDto = { refreshToken?: string };

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Session)
    private readonly sessions: Repository<Session>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokens: Repository<RefreshToken>,
    private readonly tokenService: TokenService,
  ) {}


  async signup(data: SignupDto, meta: { ip?: string; userAgent?: string }) {
    const email = (data.email ?? '').trim().toLowerCase();
    const password = data.password ?? '';

    if (!email || !password) {
      this.logger.warn(`Signup missing fields (ip=${meta.ip ?? 'unknown'})`);
      throw new BadRequestException('Email and password are required.');
    }

    const existing = await this.users.findOne({ where: { email } });
    if (existing) {
      this.logger.warn(`Signup conflict for email=${email}`);
      throw new ConflictException('Email already in use.');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const refreshToken = this.tokenService.generateRefreshToken();
    const refreshTokenHash = this.tokenService.hashToken(refreshToken);
    const refreshExpiresAt = this.refreshExpiresAt();

    const user = await this.users.save(
      this.users.create({
        id: randomUUID(),
        email,
        password_hash: passwordHash,
        is_email_verified: false,
        failed_login_attempts: 0,
      }),
    );

    const session = await this.sessions.save(
      this.sessions.create({
        id: randomUUID(),
        user,
        ip_address: meta.ip ?? null,
        user_agent: meta.userAgent ?? null,
        device_name: null,
      }),
    );

    await this.refreshTokens.save(
      this.refreshTokens.create({
        id: randomUUID(),
        user,
        session,
        token_hash: refreshTokenHash,
        expires_at: refreshExpiresAt,
        revoked: false,
      }),
    );

    const accessToken = this.tokenService.signAccessToken(user.id, email);
    this.logger.log(`User signed up id=${user.id} email=${email}`);

    return {
      user: {
        id: user.id,
        email,
        is_email_verified: false,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(data: LoginDto, meta: { ip?: string; userAgent?: string }) {
    const email = (data.email ?? '').trim().toLowerCase();
    const password = data.password ?? '';

    if (!email || !password) {
      this.logger.warn(`Login missing fields (ip=${meta.ip ?? 'unknown'})`);
      throw new BadRequestException('Email and password are required.');
    }

    const user = await this.users.findOne({ where: { email } });
    if (!user) {
      this.logger.warn(`Login failed: user not found email=${email}`);
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (!user.password_hash) {
      this.logger.warn(`Login blocked (no password) user=${user.id}`);
      throw new UnauthorizedException('Password login not available.');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      this.logger.warn(`Login failed: bad password user=${user.id}`);
      await this.users.update(user.id, {
        failed_login_attempts: user.failed_login_attempts + 1,
      });
      throw new UnauthorizedException('Invalid credentials.');
    }

    await this.users.update(user.id, { failed_login_attempts: 0 });

    const refreshToken = this.tokenService.generateRefreshToken();
    const refreshTokenHash = this.tokenService.hashToken(refreshToken);
    const refreshExpiresAt = this.refreshExpiresAt();

    const session = await this.sessions.save(
      this.sessions.create({
        id: randomUUID(),
        user,
        ip_address: meta.ip ?? null,
        user_agent: meta.userAgent ?? null,
        device_name: null,
      }),
    );

    await this.refreshTokens.save(
      this.refreshTokens.create({
        id: randomUUID(),
        user,
        session,
        token_hash: refreshTokenHash,
        expires_at: refreshExpiresAt,
        revoked: false,
      }),
    );

    const accessToken = this.tokenService.signAccessToken(user.id, user.email);
    this.logger.log(`User logged in id=${user.id} email=${user.email}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        is_email_verified: user.is_email_verified,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(data: RefreshDto) {
    const refreshToken = data.refreshToken ?? '';
    if (!refreshToken) {
      this.logger.warn('Refresh token missing');
      throw new BadRequestException('Refresh token is required.');
    }

    const tokenHash = this.tokenService.hashToken(refreshToken);

    const tokenRow = await this.refreshTokens.findOne({
      where: { token_hash: tokenHash },
      relations: ['user', 'session'],
    });

    if (!tokenRow) {
      this.logger.warn('Refresh failed: token not found');
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const now = new Date();

    if (tokenRow.revoked || tokenRow.expires_at <= now) {
      this.logger.warn(`Refresh denied for user=${tokenRow.user.id}`);
      throw new UnauthorizedException('Refresh token expired or revoked.');
    }

    const newRefreshToken = this.tokenService.generateRefreshToken();
    const newRefreshTokenHash = this.tokenService.hashToken(newRefreshToken);
    const newRefreshExpiresAt = this.refreshExpiresAt();

    await this.refreshTokens.update(tokenRow.id, { revoked: true });

    await this.refreshTokens.save(
      this.refreshTokens.create({
        id: randomUUID(),
        user: tokenRow.user,
        session: tokenRow.session,
        token_hash: newRefreshTokenHash,
        expires_at: newRefreshExpiresAt,
        revoked: false,
      }),
    );

    await this.sessions.update(tokenRow.session.id, {
      last_active_at: new Date(),
    });

    const accessToken = this.tokenService.signAccessToken(
      tokenRow.user.id,
      tokenRow.user.email,
    );
    this.logger.log(`Refresh success user=${tokenRow.user.id}`);

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
    };
  }

  private refreshExpiresAt() {
    const days = Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS ?? 30);
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    return expires;
  }

}
