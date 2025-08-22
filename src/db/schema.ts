import { pgTable, text, uuid, jsonb, timestamp } from 'drizzle-orm/pg-core'
import crypto from 'node:crypto'

export const webhookTransactions = pgTable('webhook_transactions', {
	id: uuid('id')
		.primaryKey()
		.$default(() => crypto.randomUUID()),
	client_id: text('client_id'),
	invoice_id: text('invoice_id'),
	amount: text('amount'),
	description: text('description'),
	coin: text('coin'),
	status: text('status'),
	payment_methods: jsonb('payment_methods'),
	customer: jsonb('customer'),
	transaction: jsonb('transaction'),
	merchant: jsonb('merchant'),
	extradata: jsonb('extradata'),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow(),
})

export const DomiciliationTransactions = pgTable('domiciliation_transactions', {
	id: uuid('id')
		.primaryKey()
		.$default(() => crypto.randomUUID()),
	status: text('status').default('pending'),
	reference: text('reference'),
	amount: text('amount'),
	code: text('code'),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow(),
})
