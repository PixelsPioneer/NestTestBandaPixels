import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService) {
    super();
  }
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    const _dbUrl = this.configService.getOrThrow<string>('DATABASE_URL');
    this.logger.log('Connected to the database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from the database');
  }
}
