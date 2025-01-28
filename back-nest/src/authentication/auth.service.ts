import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UsersService } from './user.service';
import { SignInDto } from '../dto/signIn.dto';
import { SignUpDto } from '../dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(payload: SignInDto): Promise<{ access_token: string }> {
    const { login, password } = payload;

    const user = await this.usersService.findUserByLogin(login);

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

  async signUp(
    payload: SignUpDto,
  ): Promise<{ message: string; user: { login: string; role: string } }> {
    const { login, password } = payload;

    const newUser = await this.usersService.createUser(login, password);

    return {
      message: 'User created successfully',
      user: {
        login: newUser.login,
        role: newUser.role,
      },
    };
  }
}
