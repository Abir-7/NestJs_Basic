/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { DB_STRING } from '../../../database/database_identifier';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from '../../../database/all_schema';

import { eq, getTableColumns } from 'drizzle-orm';
import { TUserStatus, user_status, Users } from './user.schema';

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

  async findUserByEmailForLogin(email: string) {
    const user = await this.database.query.Users.findFirst({
      where: eq(schema.Users.email, email),
    });

    if (!user) return null;

    return user;
  }

  async findUserByEmail(email: string) {
    const { password, ...rest } = getTableColumns(schema.Users);

    const user = await this.database
      .select(rest)
      .from(schema.Users)
      .where(eq(schema.Users.email, email))
      .limit(1);
    return user[0] ?? null;
  }

  async updateUserEmailVerifyStatus(
    user_id: string,
    isVerified: boolean,
    tx?: NodePgDatabase<typeof schema>,
  ) {
    const db = tx ?? this.database;
    return await db
      .update(schema.Users)
      .set({ is_verified: isVerified, updated_at: new Date() })
      .where(eq(schema.Users.id, user_id))
      .returning();
  }

  async updateUserStatus(
    data: {
      account_status: TUserStatus;
      need_to_reset_password?: boolean;
      is_verified?: boolean;
    },
    user_id: string,
    tx?: NodePgDatabase<typeof schema>,
  ) {
    const db = tx ?? this.database;

    const updateFields: Partial<{
      account_status: TUserStatus;
      need_to_reset_password?: boolean;
      is_verified?: boolean;
    }> = {};

    if (data.account_status !== undefined) {
      const validStatuses = user_status;
      if (!validStatuses.includes(data.account_status)) {
        throw new Error(`Invalid account_status: ${data.account_status}`);
      }
      updateFields.account_status = data.account_status;
    }

    if (data.need_to_reset_password !== undefined) {
      if (typeof data.need_to_reset_password !== 'boolean') {
        throw new Error(`need_to_reset_password must be a boolean`);
      }
      updateFields.need_to_reset_password = data.need_to_reset_password;
    }

    if (data.is_verified !== undefined) {
      if (typeof data.is_verified !== 'boolean') {
        throw new Error(`is_verified must be a boolean`);
      }
      updateFields.is_verified = data.is_verified;
    }

    if (Object.keys(updateFields).length === 0) {
      throw new Error('No valid fields provided to update');
    }

    return await db
      .update(Users)
      .set(updateFields)
      .where(eq(Users.id, user_id))
      .returning();
  }

  async deleteUserById(userId: string) {
    const result = await this.database
      .delete(schema.Users)
      .where(eq(schema.Users.id, userId));

    return { deleted: result.rowCount };
  }
}
