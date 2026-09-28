import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';

type TRegisterBody = {
  username: string;
  email: string;
  password: string;
};

type TLoginBody = {
    username: string
    password: string
}


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    this.authService = authService;
  }

  @Post('register')
  register(@Body() { username, email, password }: TRegisterBody) {
    return this.authService.register({ username, email, password });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() { username, password }: TLoginBody) {
    return this.authService.login({ username, password });
  }
}
