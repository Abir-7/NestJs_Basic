/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/app/modules/profiles/profile.dto.ts
import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';

import type { TGender } from './user_profile.schema';
import { gender_values } from './user_profile.schema';

export class CreateProfileDTO {
  @IsUUID()
  @IsNotEmpty()
  user_id: string; // required to link profile to user

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  full_name: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  mobile?: string;

  @IsEnum(gender_values)
  @IsOptional()
  gender?: TGender;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  image?: string;
}

export class UpdateProfileDTO extends (PartialType(
  OmitType(CreateProfileDTO, ['user_id'] as const),
) as new () => Partial<Omit<CreateProfileDTO, 'user_id'>>) {}
