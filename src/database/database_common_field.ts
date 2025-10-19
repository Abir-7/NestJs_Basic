import { sql } from 'drizzle-orm';
import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
  created_at: timestamp('created_at', { withTimezone: true }).default(
    sql`NOW()`,
  ),
  updated_at: timestamp('updated_at', { withTimezone: true }).default(
    sql`NOW()`,
  ),
  deleted_at: timestamp('deleted_at', { withTimezone: true }).default(
    sql`NULL`,
  ),
};
