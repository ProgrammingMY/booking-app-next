import { magicLinkClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL, // the base url of your auth server
    plugins: [
        magicLinkClient()
    ]
})

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    $Infer
} = authClient;