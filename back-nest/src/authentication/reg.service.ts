import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../../prisma/prisma.service';
import { SignUpDto } from '../dto/signup.dto';
import { CheckLoginDto } from '../dto/checkLogin.dto';

@Injectable()
export class RegisterService {
  constructor(private prisma: PrismaService) {}

  async checkLoginAvailability(checkLogin: CheckLoginDto): Promise<boolean> {
    const { login } = checkLogin;

    const existingUser = await this.prisma.user.findUnique({
      where: { login },
    });
    return existingUser ? false : true;
  }

  async signup(user: SignUpDto) {
    const { login, password } = user;

    const existingUser = await this.prisma.user.findUnique({
      where: { login },
    });
    if (existingUser) {
      throw new Error('User with this login already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        login,
        password: hashedPassword,
        role: 'user',
      },
    });

    return {
      message: 'User created successfully',
      user: { login: newUser.login, role: newUser.role },
    };
  }
}
