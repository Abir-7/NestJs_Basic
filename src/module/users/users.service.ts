import { Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { CreateUserDTO } from './user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers() {
    return this.userRepository.findAll();
  }

  async createUser(data: CreateUserDTO) {
    try {
      return this.userRepository.createUser(data);
    } catch (error) {
      throw new Error(error);
    }
  }
}
