/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from '../user/users/user.dto';
import { makeOtp } from '../../utils/helper/make-otp.util';
import { makeExpireTime } from '../../utils/helper/make-expire-time.util';
import { UserRepository } from '../user/users/user.repository';
import { AuthRepository } from './auth.repository';
import { UserAuthenticationRepository } from '../user/user_authentication/user_authentication.repository';
import { isExpired } from '../../utils/helper/isExpired';
import getHashedPassword from '../../utils/helper/getHashedPassword';
import isPasswordMatch from '../../utils/helper/isPasswordMatch';
import { JwtService } from '@nestjs/jwt';
import { IAuthData, IDecodedData } from './auth.interface';
import { jwtConstants } from './auth.constants';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly userAuthenticationRepository: UserAuthenticationRepository,
    private jwtService: JwtService,
  ) {}
  async createUser(data: CreateUserDTO) {
    const user_email = data.email.toLowerCase();

    const code = makeOtp(4);
    const expire_time = makeExpireTime(10);
    const existedUser = await this.userRepository.findUserByEmail(user_email);

    if (existedUser && existedUser.email) {
      await this.userRepository.deleteUserById(existedUser.id);
    }

    return this.authRepository.createUser(
      {
        email: user_email,
        password: await getHashedPassword(data.password),
      },
      data.profile_data,
      { code, expire_time, type: 'email' },
    );
  }

  async verifyUserEmail(user_id: string, otp: string) {
    const authentication_data =
      await this.userAuthenticationRepository.getUserAuthenticationByUserIdAndOpt(
        user_id,
        otp,
      );

    if (!authentication_data) {
      throw new Error('Please check provided credentials.');
    }

    if (authentication_data?.is_success) {
      throw new Error('This code is used before.');
    }

    if (
      authentication_data?.expire_time &&
      isExpired(authentication_data?.expire_time)
    ) {
      throw new Error('Verification time expired.');
    }

    return await this.authRepository.verifyUserEmail(
      user_id,
      authentication_data.id,
    );
  }

  async userLogin(data: { email: string; password: string }) {
    const user_email = data.email.toLowerCase();

    const user_data =
      await this.userRepository.findUserByEmailForLogin(user_email);

    if (!user_data) {
      throw new Error('Account not found.');
    }

    if (!(await isPasswordMatch(data.password, user_data.password))) {
      throw new Error('Password not matched.');
    }
    const payload: IAuthData = {
      user_email: user_data.email,
      user_id: user_data.id,
      user_role: user_data.role,
    };

    //! need to make appConfig for env

    try {
      const access_token = this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: '7d',
      });

      const refresh_token = this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: '7d',
      });

      const decoded_access_data: IDecodedData =
        this.jwtService.decode(access_token);

      const decoded_refresh_data: IDecodedData =
        this.jwtService.decode(access_token);

      return {
        access_token,
        refresh_token,
        access_token_exp: decoded_access_data.exp,
        refresh_token_exp: decoded_refresh_data.exp,
        user_id: decoded_access_data.user_id,
        user_role: decoded_access_data.user_role,
      };
    } catch (error) {
      throw new Error('Failed to login.');
    }
  }
}
