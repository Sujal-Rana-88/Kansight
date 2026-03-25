import { Body, Controller, Post, Req, Logger } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: { email?: string; password?: string }, @Req() req: Request) {
    const userAgent =
      typeof req.headers['user-agent'] === 'string'
        ? req.headers['user-agent']
        : undefined;
    this.logger.debug(`Signup request ip=${req.ip ?? 'unknown'}`);
    return this.authService.signup(body, {
      ip: req.ip,
      userAgent,
    });
  }

  @Post('login')
  login(@Body() body: { email?: string; password?: string }, @Req() req: Request) {
    const userAgent =
      typeof req.headers['user-agent'] === 'string'
        ? req.headers['user-agent']
        : undefined;
    this.logger.debug(`Login request ip=${req.ip ?? 'unknown'}`);
    return this.authService.login(body, {
      ip: req.ip,
      userAgent,
    });
  }

  @Post('refresh')
  refresh(@Body() body: { refreshToken?: string }) {
    this.logger.debug('Refresh request');
    return this.authService.refresh(body);
  }
}
