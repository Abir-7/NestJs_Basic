/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateProfileDTO } from '../user_profile/user_profile.dto';
import { PickType } from '@nestjs/mapped-types';

class ProfileNameDTO extends PickType(CreateProfileDTO, [
  'full_name',
] as const) {}

export class CreateUserDTO {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
  @ValidateNested()
  @Type(() => ProfileNameDTO)
  profile_data: ProfileNameDTO;
}
