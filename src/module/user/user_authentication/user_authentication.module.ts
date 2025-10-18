import { Module } from '@nestjs/common';
import { UserAuthenticationRepository } from './user_authentication.repository';
import { DatabaseModule } from '../../../database/database.module';
import { UserAuthenticationController } from './user_authentication.controller';
import { UserAuthenticationService } from './user_authentication.service';

@Module({
  imports: [DatabaseModule],
  exports: [UserAuthenticationRepository, UserAuthenticationService],
  controllers: [UserAuthenticationController],
  providers: [UserAuthenticationRepository, UserAuthenticationService],
})
export class UserAuthenticationModule {}
