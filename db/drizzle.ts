import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import * as authSchema from './auth-schema'
import * as rentSchema from './rent-schema'
const connectionString = process.env.DATABASE_URL as string

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema: { ...schema, ...authSchema, ...rentSchema } })