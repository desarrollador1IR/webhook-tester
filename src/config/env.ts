import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.string().min(1),
	WEBHOOK_SECRET_KEY: z.string().min(1),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error(
		"❌ Invalid environment variables:",
		parsedEnv.error.flatten().fieldErrors,
	);
	throw new Error("Invalid environment variables.");
}

export const env = parsedEnv.data;
