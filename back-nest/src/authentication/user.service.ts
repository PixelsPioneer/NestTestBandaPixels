import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUserByLogin(login: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { login },
    });
  }
  async findUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async createUser(login: string, hashedPassword: string): Promise<User> {
    const existingUser = await this.findUserByLogin(login);

    if (existingUser) {
      throw new BadRequestException('User with this login already exists');
    }

    return this.prisma.user.create({
      data: {
        login,
        password: hashedPassword,
        role: 'user',
      },
    });
  }
}
