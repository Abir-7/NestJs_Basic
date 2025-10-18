import { Module } from '@nestjs/common';
import { UserProfileController } from './user_profile.controller';
import { UserProfilesService } from './user_profile.service';
import { UserProfilesRepository } from './user_profiles.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  controllers: [UserProfileController],
  providers: [UserProfilesService, UserProfilesRepository],
  exports: [UserProfilesService, UserProfilesRepository],
  imports: [DatabaseModule],
})
export class UserProfilesModule {}
