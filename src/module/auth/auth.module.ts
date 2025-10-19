import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';

import { DatabaseModule } from '../../database/database.module';
import { UserModule } from '../user/users/users.module';
import { UserProfilesModule } from '../user/user_profile/user_profiles.module';
import { UserAuthenticationModule } from '../user/user_authentication/user_authentication.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.register({}), // empty, we will sign manually
    DatabaseModule,
    UserModule,
    UserProfilesModule,
    UserAuthenticationModule,
  ],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}
