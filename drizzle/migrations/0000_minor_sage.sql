CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" text DEFAULT '2025-10-16T10:21:47.071Z',
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
