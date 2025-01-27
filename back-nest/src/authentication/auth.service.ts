import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    login: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(login);

    if (user?.password !== password) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const payload = { sub: user.user_id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
