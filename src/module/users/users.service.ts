import { Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { CreateUserDTO } from './user.dto';
import { makeOtp } from '../../utils/helper/make-otp.util';
import { makeExpireTime } from '../../utils/helper/make-expire-time.util';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUserDTO) {
    const code = makeOtp(4);
    const expire_time = makeExpireTime(10);
    const existedUser = await this.userRepository.findUserByEmail(data.email);

    if (existedUser && existedUser.email) {
      await this.userRepository.deleteUserById(existedUser.id);
    }

    return this.userRepository.createUser(
      {
        email: data.email,
        password: data.password,
      },
      { full_name: data.profile_data.full_name },
      { code, expire_time, type: 'email' },
    );
  }
}
