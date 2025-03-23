import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
export default function TimeSlotsPage() {
  return (
    <div>
      <h1>Time Slots</h1>
      <Button className="gap-2"
        asChild>
        <Link href="/time-slots/new">
          <PlusCircle className="h-4 w-4" /> Create Time Slot
        </Link>
      </Button>
    </div>
  )
}
