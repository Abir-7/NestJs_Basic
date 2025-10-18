import { Inject } from '@nestjs/common';
import { DB_STRING } from '../../../database/database_identifier';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from '../../../database/all_schema';

export class UserProfilesRepository {
  constructor(
    @Inject(DB_STRING) private database: NodePgDatabase<typeof schema>,
  ) {}

  async createUserProfile(
    data: typeof schema.UserProfiles.$inferInsert,
    tx?: NodePgDatabase<typeof schema>,
  ) {
    console.log(data);

    const db = tx ?? this.database;
    return await db.insert(schema.UserProfiles).values(data).returning();
  }
}
