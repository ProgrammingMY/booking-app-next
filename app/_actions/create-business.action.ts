"use server"

import "server-only"

import { authenticateUser } from "@/lib/authenticateUser"

export async function createBusiness(unsafeData: BusinessFormValues) {
    const { user } = await authenticateUser();
}