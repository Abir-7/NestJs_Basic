import { Inject, Injectable } from '@nestjs/common';
import { DB_STRING } from '../../database/database';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DB_STRING) private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findAll() {
    return this.database.query.Users.findMany();
  }

  async createUser(data: typeof schema.Users.$inferInsert) {
    try {
      return this.database.insert(schema.Users).values(data).returning();
    } catch (error) {
      throw new Error(error);
    }
  }
}
