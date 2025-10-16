/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { DB_STRING } from './database';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

import * as UsersSchema from '../module/users/schema';
@Module({
  providers: [
    {
      provide: DB_STRING,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow('DATABASE_URL'),
        });
        return drizzle(pool, {
          schema: { ...UsersSchema },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DB_STRING],
})
export class DatabaseModule {}
