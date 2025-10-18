CREATE TYPE "public"."user_status" AS ENUM('active', 'pending_verification', 'blocked', 'disabled', 'deleted');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "account_status" "user_status" DEFAULT 'pending_verification' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "need_to_reset_password" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;