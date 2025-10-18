/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { DB_STRING } from './database_identifier';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { schema } from './all_schema';

@Module({
  providers: [
    {
      provide: DB_STRING,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow('DATABASE_URL'),
        });
        return drizzle(pool, {
          schema: schema,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DB_STRING],
})
export class DatabaseModule {}
