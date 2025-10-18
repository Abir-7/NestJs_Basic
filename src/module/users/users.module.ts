import { UserAuthenticationModule } from './../user_authentication/user_authentication.module';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '../../database/database.module';
import { UserRepository } from './user.repository';
import { UserProfilesModule } from '../user_profile/user_profiles.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  imports: [DatabaseModule, UserProfilesModule, UserAuthenticationModule],
})
export class UserModule {}
