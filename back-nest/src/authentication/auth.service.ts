import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../../prisma/prisma.service';
import { SignInDto } from '../dto/signIn.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(payload: SignInDto): Promise<{ access_token: string }> {
    const { login, password } = payload;

    const user = await this.prisma.user.findUnique({
      where: { login },
    });

    console.log({ user, payload });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid login or password');
    }

    return {
      access_token: await this.jwtService.signAsync({
        sub: user.user_id,
        role: user.role,
      }),
    };
  }
}
