import type { Config } from "drizzle-kit";

export default {
    schema: [
        "./db/schema.ts",
        "./db/auth-schema.ts",
        "./db/rent-schema.ts"
    ],
    out: "./migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
} satisfies Config;