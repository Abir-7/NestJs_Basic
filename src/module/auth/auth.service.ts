import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from '../user/users/user.dto';
import { makeOtp } from '../../utils/helper/make-otp.util';
import { makeExpireTime } from '../../utils/helper/make-expire-time.util';
import { UserRepository } from '../user/users/user.repository';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
  ) {}
  async createUser(data: CreateUserDTO) {
    const code = makeOtp(4);
    const expire_time = makeExpireTime(10);
    const existedUser = await this.userRepository.findUserByEmail(data.email);

    if (existedUser && existedUser.email) {
      await this.userRepository.deleteUserById(existedUser.id);
    }

    return this.authRepository.createUser(
      {
        email: data.email,
        password: data.password,
      },
      data.profile_data,
      { code, expire_time, type: 'email' },
    );
  }
}
