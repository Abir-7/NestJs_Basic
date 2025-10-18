import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/users/users.module';
import { UserProfilesModule } from '../user/user_profile/user_profiles.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    UserProfilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
