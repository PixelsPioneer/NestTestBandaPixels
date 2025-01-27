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

import { GetUser } from '../decorators/get-user.decorator';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from '../dto/signIn.dto';
import { UserDto } from '../dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body.login, body.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@GetUser() user: UserDto) {
    return user;
  }
}
