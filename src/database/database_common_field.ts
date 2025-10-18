import { sql } from 'drizzle-orm';
import { text } from 'drizzle-orm/pg-core';

export const timestamps = {
  created_at: text('created_at').default(sql`NOW()`),
  updated_at: text('updated_at').default(sql`NOW()`),
  deleted_at: text('deleted_at').default(sql`NULL`), // deleted_at usually null initially
};
