// profiles.service.ts
import { Injectable } from '@nestjs/common';
import { UserProfilesRepository } from './user_profiles.repository';
import { CreateProfileDTO } from './user_profile.dto';

@Injectable()
export class UserProfilesService {
  constructor(private repo: UserProfilesRepository) {}

  async create(profile_data: CreateProfileDTO) {
    const profile = await this.repo.createUserProfile(profile_data);
    return profile;
  }
}
