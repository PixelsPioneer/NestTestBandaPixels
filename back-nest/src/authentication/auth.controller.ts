import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';

import { User } from '../decorators/user.decorator';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignUpDto } from '../dto/signup.dto';
import { SignInDto } from '../dto/signIn.dto';
import { UserDto } from '../dto/user.dto';
import { RefreshTokenDto } from '../dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signup(@Body() user: SignUpDto) {
    return this.authService.signUp(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @Post('refresh')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refresh_token);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@User() user: UserDto) {
    return user;
  }
}
