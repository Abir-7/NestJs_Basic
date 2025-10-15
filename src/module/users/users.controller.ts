import { Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  getUsers() {
    return 'You will get user list';
  }
  @Post('/:id')
  createUser() {
    return 'You will create user';
  }
}
