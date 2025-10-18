import { Module } from '@nestjs/common';
import { UserAuthenticationRepository } from './user_authentication.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  exports: [UserAuthenticationRepository],
  controllers: [],
  providers: [UserAuthenticationRepository],
})
export class UserAuthenticationModule {}
