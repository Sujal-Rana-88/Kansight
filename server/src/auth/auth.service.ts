import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signup(data: any) {
    return { message: 'User signed up', data };
  }

  login(data: any) {
    return { message: 'User logged in', data };
  }
}