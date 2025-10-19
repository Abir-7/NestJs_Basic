import { Body, Controller, HttpCode, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../user/users/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: CreateUserDTO) {
    return this.authService.createUser(data);
  }

  @Patch('verify_user_email')
  async verifyUserEmail(
    @Body('user_id') user_id: string,
    @Body('code') code: string,
  ) {
    return this.authService.verifyUserEmail(user_id, code);
  }

  @Post('login')
  @HttpCode(200)
  async userLogin(@Body() data: { email: string; password: string }) {
    return this.authService.userLogin(data);
  }
}
