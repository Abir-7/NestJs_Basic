/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../user/users/user.dto';

import { GlobalFileInterceptor } from '../../common/interceptors/global-file.interceptor';
import { getFileId } from '../../utils/helper/getFileId';

import { base_url } from '../../config/app.config';
import { parseJsonData } from '../../utils/helper/parseJson';

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

  @Patch('update_profile')
  @UseInterceptors(GlobalFileInterceptor('file'))
  updateUserProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { data: any },
  ) {
    const file_id = getFileId(file.path);
    const file_url = base_url + file_id;
    console.log(file_id, file_url);
    console.log(parseJsonData(body.data));
  }
}
