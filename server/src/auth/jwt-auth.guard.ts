import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { verify, type Secret } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email?: string };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization ?? '';
    const [, token] = authHeader.split(' ');

    if (!token) {
      throw new UnauthorizedException('Missing auth token');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException('Missing JWT secret');
    }

    try {
      const payload = verify(token, secret as Secret) as { sub?: string; email?: string };
      if (!payload?.sub) {
        throw new UnauthorizedException('Invalid token');
      }
      request.user = { id: payload.sub, email: payload.email };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
