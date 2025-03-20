import { Building, CalendarIcon, ChevronUp, Clock, LayoutDashboard, Settings, User2, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar"
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const BusinessMenuItems = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard"
    },
    {
        label: "Reservations",
        icon: CalendarIcon,
        href: "/reservations"
    },
    {
        label: "Time Slots",
        icon: Clock,
        href: "/time-slots"
    },
    {
        label: "Business Settings",
        icon: Settings,
        href: "/business-settings"
    },
    {
        label: "Customers",
        icon: Users,
        href: "/customers"
    },
]

const SettingsMenuItems = [
    {
        label: "Account Settings",
        icon: Settings,
        href: "/account-settings"
    }
]
export default function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <h2 className="text-xl font-semibold p-2">Owner Portal</h2>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Your Business</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {BusinessMenuItems.map((item) => {
                                return (
                                    <SidebarMenuItem key={item.label}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.href}>
                                                <item.icon className="h-4 w-4" />
                                                {item.label}
                                            </Link>
                                        </SidebarMenuButton>

                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Settings</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {SettingsMenuItems.map((item) => {
                                return (
                                    <SidebarMenuItem key={item.label}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.href}>
                                                <item.icon className="h-4 w-4" />
                                                {item.label}
                                            </Link>
                                        </SidebarMenuButton>

                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> Username
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            {/* <div className="mt-auto pt-4">
                <div className="flex items-center gap-2 p-2">
                    <Avatar>
                        <AvatarImage src={data.user?.image || ""} alt={data.user?.name || ""} />
                        <AvatarFallback>{data.user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{data.user.name}</span>
                        <span className="text-xs text-muted-foreground">{data.user.email}</span>
                    </div>
                </div>
            </div> */}
        </Sidebar>
    )
}