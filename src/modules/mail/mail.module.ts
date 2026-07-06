import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      // imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        defaults: {
          from: config.get<string>('MAIL_FROM'),
        },
        transport: {
          host: config.get<string>('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT'),
          secure: false,
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASSWORD'),
          },
        },
      }),
    }),
  ],
  exports: [MailService],
  providers: [MailService],
})
export class MailModule {}
