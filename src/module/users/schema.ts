import { pgTable, uuid, text, varchar } from 'drizzle-orm/pg-core';

// Define users table
export const Users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  created_at: text('created_at').default(new Date().toISOString()),
});
