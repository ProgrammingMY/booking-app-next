"use client"

import { signOut } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const router = useRouter();

    return (
        <Button onClick={() => signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                }
            }
        })}>Sign Out</Button>
    )
}