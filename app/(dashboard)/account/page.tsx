import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authenticateUser } from "@/lib/authenticateUser";
import { redirect } from "next/navigation";

export default async function AccountPage() {
    const { user } = await authenticateUser();

    if (!user) {
        return redirect("/")
    }

    return (
        <Card className="md:col-span-2 mx-auto max-w-3xl">
            <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                        <div>
                            <h3 className="text-sm font-medium mb-2">Name</h3>
                            <p className="text-sm text-muted-foreground">{user.name}</p>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="text-sm font-medium mb-2">Email</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="pt-4">
                            <Button>Edit Profile</Button>
                        </div>
                    </div>
                    <Separator orientation="vertical" className="hidden md:block" />
                    <div className="flex-1 space-y-4">
                        <div>
                            <h3 className="text-sm font-medium mb-2">Notification Preferences</h3>
                            <p className="text-sm text-muted-foreground">Email notifications enabled</p>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="text-sm font-medium mb-2">Security</h3>
                            <p className="text-sm text-muted-foreground">Last password change: Never</p>
                        </div>
                        <div className="pt-4">
                            <Button variant="outline">Change Password</Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}