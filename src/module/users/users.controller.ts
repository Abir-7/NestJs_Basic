import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userServices: UsersService) {}

  @Post()
  async createUser(@Body() data: CreateUserDTO) {
    return this.userServices.createUser(data);
  }
}
