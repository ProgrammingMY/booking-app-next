import { NextResponse } from "next/server"
import { db } from "@/db/drizzle"
import { eq } from "drizzle-orm"
import { business } from "@/db/schema"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    if (!slug) {
        return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    // check if slug is available
    const existingBusiness = await db.query.business.findFirst({
        where: eq(business.slug, slug)
    })

    if (existingBusiness) {
        return NextResponse.json({ isAvailable: false }, { status: 200 })
    }

    return NextResponse.json({ isAvailable: true }, { status: 200 })
}