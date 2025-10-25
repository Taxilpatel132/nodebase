'use client';

import { CreditCardIcon,FolderOpenIcon,HistoryIcon,icons,KeyIcon,LogOutIcon,StarIcon } from "lucide-react";
import { usePathname,useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Sidebar,
    SidebarGroup,
    SidebarContent,
    SidebarFooter,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
   
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { on } from "events";

const manuItems = [
    {
        title:'main',
        items:[{
            title:'workflows',
            icon:FolderOpenIcon,
            url:'/workflows'
        },
        {
            title:'credentials',
            icon:KeyIcon,
            url:'/credentials'
        },
        {
            title:'executions',
            icon:HistoryIcon,
            url:'/executions'
        }
    ] 
    }
]

export const AppSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="h-10 px-4 gap-x-4">
                        <Link href="/" prefetch>
                        <Image
                            src="/logos/logo.svg"
                            alt="NodeBase"
                            width={30}
                            height={30}
                        />
                        <span className="font-semibold text-sm">NodeBase</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>
            <SidebarContent>
                {manuItems.map((group)=>(
                    <SidebarGroup key={group.title}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                            {group.items.map((item)=>(
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton 
                                    tooltip={item.title}
                                    asChild
                                    isActive={item.url=="/"?pathname==='/':pathname.startsWith(item.url)}
                                    className="gap-x-4 h-10 px-4"
                                    >

                                    <Link href={item.url} prefetch>
                                        <item.icon className="size-4"/>
                                        <span>{item.title}</span>
                                    </Link>

                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                      </SidebarGroup>
                ))}  
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="upgrade to pro" className="gap-x-4 h-10 px-4" onClick={()=>{}}>
                            <StarIcon className="h-4 w-4"/>
                            <span>Upgrade to Pro</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Billing portal" className="gap-x-4 h-10 px-4" onClick={()=>{}}>
                            <CreditCardIcon className="h-4 w-4"/>
                            <span>Billing portal</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Sign Out" className="gap-x-4 h-10 px-4" onClick={()=>{
                            authClient.signOut({
                                fetchOptions:{
                                    onSuccess: () => {
                                        router.push('/login');
                                    },
                                },
                            })
                        }}>
                            <LogOutIcon className="h-4 w-4"/>
                            <span>Sign Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}