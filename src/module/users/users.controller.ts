import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userservices: UsersService) {}
  @Get()
  async getUsers() {
    return await this.userservices.getUsers();
  }
  @Post('')
  async createUser(@Body() data: CreateUserDTO) {
    return this.userservices.createUser(data);
  }
}
