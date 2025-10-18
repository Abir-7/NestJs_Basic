import { pgEnum } from 'drizzle-orm/pg-core';
import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { timestamps } from '../../../database/database_common_field';
import { uuid } from 'drizzle-orm/pg-core';
import { Users } from '../users/user.schema';

export const AuthTypeEnum = pgEnum('auth_type', [
  'email',
  'reset_pass',
  'resend',
]);
export type IAuthType = (typeof AuthTypeEnum.enumValues)[number];

export const UserAuthentication = pgTable('user_authentication', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id')
    .notNull()
    .unique()
    .references(() => Users.id, {
      onDelete: 'cascade',
    }),
  code: text('code'),
  token: text('token'),
  expire_time: timestamp('expire_time').notNull(),
  is_success: boolean('is_success').default(false),
  type: AuthTypeEnum('type').notNull(),
  ...timestamps,
});
