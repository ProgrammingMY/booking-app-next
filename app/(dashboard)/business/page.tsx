import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BusinessPage() {
    return (
        <div>
            <h1>Business</h1>
            <Button>
                <Link href="/business/new">
                    <Plus />
                    New Business
                </Link>
            </Button>
        </div>
    )
}