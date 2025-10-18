import { Inject } from '@nestjs/common';
import { DB_STRING } from '../../database/database_identifier';

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from '../../database/all_schema';

export class UserAuthenticationRepository {
  constructor(
    @Inject(DB_STRING) private database: NodePgDatabase<typeof schema>,
  ) {}

  async createAuthenticationForUser(
    data: typeof schema.UserAuthentication.$inferInsert,
    tx?: NodePgDatabase<typeof schema>,
  ) {
    const db = tx ?? this.database;
    return await db.insert(schema.UserAuthentication).values(data).returning();
  }
}
