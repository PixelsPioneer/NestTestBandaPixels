import { Injectable, BadRequestException } from '@nestjs/common';
import { user } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUserByLogin(login: string): Promise<user | null> {
    return this.prisma.user.findUnique({
      where: { login },
    });
  }

  async createUser(login: string, password: string): Promise<user> {
    const existingUser = await this.findUserByLogin(login);

    if (existingUser) {
      throw new BadRequestException('User with this login already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        login,
        password: hashedPassword,
        role: 'user',
      },
    });
  }
}
