import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from '../dto/signIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.login, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
