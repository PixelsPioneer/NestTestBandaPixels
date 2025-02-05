import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

import { UsersService } from './user.service';
import { SignInDto } from '../dto/signIn.dto';
import { SignUpDto } from '../dto/signup.dto';
import { jwtConstants } from './constants';
import { types } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    payload: SignInDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { login, password } = payload;

    const user = await this.usersService.findUserByLogin(login);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      user.user_id,
      user.role,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(refresh_token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(refresh_token, {
        secret: jwtConstants.refreshToken,
      });

      const user = await this.usersService.findUserById(decoded.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { accessToken, refreshToken } = await this.generateTokens(
        user.user_id,
        user.role,
      );

      return { access_token: accessToken, refresh_token: refreshToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async signUp(
    payload: SignUpDto,
  ): Promise<{ message: string; user: { login: string; role: string } }> {
    const { login, password } = payload;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersService.createUser(login, hashedPassword);

    return {
      message: 'User created successfully',
      user: {
        login: newUser.login,
        role: newUser.role,
      },
    };
  }

  async generateTokens(userId: number, role: Role = Role.user) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, role, type: types.access },
      { expiresIn: '1h' },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, role, type: types.refresh },
      { secret: jwtConstants.refreshToken, expiresIn: '1d' },
    );

    return { accessToken, refreshToken };
  }
}
