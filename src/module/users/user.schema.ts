import { pgEnum } from 'drizzle-orm/pg-core';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from '../../database/database_common_field';
import { relations } from 'drizzle-orm';
import { UserProfiles } from '../user_profile/user_profile.schema';
import { boolean } from 'drizzle-orm/pg-core';

export const user_status = [
  'active',
  'pending_verification',
  'blocked',
  'disabled',
  'deleted',
] as const;

export const UserStatusEnum = pgEnum('user_status', user_status);
export type TUserStatus = (typeof user_status)[number];

const roleValues = ['user', 'super_admin'] as const;
export const RoleEnum = pgEnum('role_enum', roleValues);
export type TRole = (typeof roleValues)[number];

// Define users table
export const Users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  role: RoleEnum('role').default('user'),
  email: varchar('email', { length: 255 }).notNull().unique(),
  account_status: UserStatusEnum('account_status')
    .notNull()
    .default('pending_verification'),
  need_to_reset_password: boolean('need_to_reset_password')
    .notNull()
    .default(false),
  is_verified: boolean('is_verified').notNull().default(false),
  password: varchar('password', { length: 255 }).notNull(),
  ...timestamps,
});

export const UsersRelations = relations(Users, ({ one }) => ({
  profile: one(UserProfiles, {
    fields: [Users.id],
    references: [UserProfiles.user_id],
  }),
}));
