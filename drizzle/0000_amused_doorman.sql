CREATE TABLE "domiciliation_transactions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'pending',
	"reference" text,
	"amount" text,
	"code" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "webhook_transactions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"client_id" text,
	"invoice_id" text,
	"amount" text,
	"description" text,
	"coin" text,
	"status" text,
	"payment_methods" jsonb,
	"customer" jsonb,
	"transaction" jsonb,
	"merchant" jsonb,
	"extradata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
