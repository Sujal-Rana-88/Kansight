import { BadRequestException, Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { sign, type Secret, type SignOptions } from 'jsonwebtoken';

@Injectable()
export class TokenService {
  signAccessToken(userId: string, email: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new BadRequestException('Missing JWT_SECRET in env.');
    }
    const expiresIn = process.env.JWT_EXPIRES_IN ?? '15m';
    const options: SignOptions = { expiresIn };
    return sign({ sub: userId, email }, secret as Secret, options);
  }

  generateRefreshToken() {
    return randomBytes(48).toString('hex');
  }

  hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
