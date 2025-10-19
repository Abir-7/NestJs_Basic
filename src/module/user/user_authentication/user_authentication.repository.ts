import { Inject, Injectable } from '@nestjs/common';
import { DB_STRING } from '../../../database/database_identifier';

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from '../../../database/all_schema';
import { and, eq } from 'drizzle-orm';
@Injectable()
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

  async getUserAuthenticationByUserIdAndOpt(user_id: string, otp: string) {
    const db = this.database;
    return await db.query.UserAuthentication.findFirst({
      where: and(
        eq(schema.UserAuthentication.user_id, user_id),
        eq(schema.UserAuthentication.code, otp),
      ),
    });
  }

  async updateUserAuthenticationByUserIdAndOpt(
    authentication_id: string,
    tx?: NodePgDatabase<typeof schema>,
  ) {
    const db = tx ?? this.database;
    return await db
      .update(schema.UserAuthentication)
      .set({
        is_success: true,
        updated_at: new Date(),
      })
      .where(eq(schema.UserAuthentication.id, authentication_id))
      .returning();
  }
}
