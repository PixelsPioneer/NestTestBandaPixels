import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UsersService } from './user.service';
import { AuthController } from './auth.controller';
import { jwtConfig } from '../constant/constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConfig.accessToken,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}
