import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { authenticateUser } from "@/lib/authenticateUser";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { business } from "@/db/schema";

const order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default async function BusinessPage() {
    const { user } = await authenticateUser();

    if (!user) {
        return redirect("/")
    }

    const userBusiness = await db.query.business.findFirst({
        where: eq(business.ownerId, user.id)
    })

    if (!userBusiness) {
        return redirect("/business/new")
    }

    // sort the business hours by the order of the days
    const businessHours = Object.entries(userBusiness.operatingHours).map(([day, hours]) => ({
        day,
        ...hours
    })).sort((a, b) => {
        return order.indexOf(a.day) - order.indexOf(b.day)
    })

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle>Business Settings</CardTitle>
                    <CardDescription>Manage your business details</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium mb-2">Business Name</h3>
                            <p className="text-sm text-muted-foreground">{userBusiness?.name}</p>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="text-sm font-medium mb-2">Description</h3>
                            <p className="text-sm text-muted-foreground">{userBusiness?.description}</p>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="text-sm font-medium mb-2">Slug</h3>
                            <p className="text-sm text-muted-foreground">{userBusiness?.slug}</p>
                        </div>
                        <div className="pt-4">
                            <Button>Edit Business</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle>Operating Hours</CardTitle>
                    <CardDescription>Set your business hours</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {businessHours.map(({ day, isOpen, openTime, closeTime }) => (
                            <div key={day} className="flex items-center justify-between">
                                <span className="font-medium">{day}</span>
                                <span className="text-sm">
                                    {isOpen ? `${openTime} - ${closeTime}` : "Closed"}
                                </span>
                            </div>
                        ))}
                        <div className="pt-4">
                            <Button>Edit Hours</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}