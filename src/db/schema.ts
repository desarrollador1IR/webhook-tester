import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const webhookTransactions = sqliteTable("webhook_transactions", {
	id: text("id").primaryKey(),
	client_id: text("client_id"),
	invoice_id: text("invoice_id"),
	amount: text("amount"),
	description: text("description"),
	coin: text("coin"),
	status: text("status"),
	payment_methods: text("payment_methods", { mode: "json" }),
	customer: text("customer", { mode: "json" }),
	transaction: text("transaction", { mode: "json" }),
	merchant: text("merchant", { mode: "json" }),
	extradata: text("extradata", { mode: "json" }),
});
