"use server"

import { auth } from "@/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";

export async function authenticateUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/sign-in")
    }

    return { user: session.user }
}