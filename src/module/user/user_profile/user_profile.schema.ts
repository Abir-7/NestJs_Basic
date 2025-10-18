// src/app/db/schema/profile.ts
import { pgTable, uuid, varchar, text } from 'drizzle-orm/pg-core';
import { Users } from '../users/user.schema';
import { pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { timestamps } from '../../../database/database_common_field';

export const gender_values = ['male', 'female', 'other'] as const;
export const GenderEnum = pgEnum('gender_enum', gender_values);
export type TGender = (typeof gender_values)[number];

export const UserProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),

  user_id: uuid('user_id')
    .notNull()
    .unique()
    .references(() => Users.id, {
      onDelete: 'cascade',
    }),

  full_name: varchar('full_name', { length: 150 }).notNull(),

  mobile: varchar('mobile', { length: 20 }),

  gender: GenderEnum('gender'), // DB enum

  address: text('address'),

  image: varchar('image'),
  ...timestamps,
});

export const UserProfileRelation = relations(UserProfiles, ({ one }) => ({
  user: one(Users, {
    fields: [UserProfiles.user_id],
    references: [Users.id],
  }),
}));
