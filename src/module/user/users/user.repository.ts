import { Inject, Injectable } from '@nestjs/common';
import { DB_STRING } from '../../../database/database_identifier';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from '../../../database/all_schema';

import { eq } from 'drizzle-orm';
import { Users } from './user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DB_STRING) private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async createUser(
    data: typeof Users.$inferInsert,
    tx?: NodePgDatabase<typeof schema>,
  ) {
    const db = tx ?? this.database;
    return await db.insert(Users).values(data).returning();
  }

  async findUserByEmail(email: string) {
    return await this.database.query.Users.findFirst({
      where: eq(schema.Users.email, email),
    });
  }

  async deleteUserById(userId: string) {
    const result = await this.database
      .delete(schema.Users)
      .where(eq(schema.Users.id, userId));

    return { deleted: result.rowCount };
  }
}
