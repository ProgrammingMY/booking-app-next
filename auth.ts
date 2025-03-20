import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { magicLink } from "better-auth/plugins";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        facebook: {
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        }
    },
    plugins: [
        magicLink({
            sendMagicLink: async ({ email, token, url }, request) => {
                // send email
                console.log(`Sending magic link to ${email}`)
                console.log(`Token: ${token}`)
                console.log(`URL: ${url}`)
            }
        })
    ]
});