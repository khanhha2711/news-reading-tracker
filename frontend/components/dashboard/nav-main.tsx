"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-4">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              asChild
              tooltip="Dashboard"
              isActive={pathname === "/dashboard"}
              className="
                min-w-8
                duration-200
                ease-linear
                hover:bg-primary/40
                hover:text-black
                active:bg-primary
                active:text-primary-foreground
                data-[active=true]:bg-primary
                data-[active=true]:text-primary-foreground
              "
            >
              <Link href="/dashboard" className="flex gap-2">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              asChild
              tooltip="Articles"
              isActive={pathname === "/articles"}
              className="
                min-w-8
                duration-200
                ease-linear
                hover:bg-primary/30
                hover:text-black
                active:bg-primary
                active:text-primary-foreground
                data-[active=true]:bg-primary
                data-[active=true]:text-primary-foreground
              "
            >
              <Link href="/articles" className="flex gap-2">
                <LayoutDashboard />
                <span>Articles</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
