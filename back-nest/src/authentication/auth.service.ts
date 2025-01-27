import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    login: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { login },
    });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const payload = { sub: user.user_id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
