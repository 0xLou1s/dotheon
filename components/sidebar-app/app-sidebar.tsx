"use client";

import * as React from "react";
import {
  BarChart3,
  BookOpen,
  Globe,
  Info,
  Settings,
  Trophy,
  Wallet,
  Coins,
  GraduationCap,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Logo } from "./logo";
import NavUser from "./nav-user";
import NavMain from "./nav-main";

// Updated data for Bifrost DeFi Dashboard
const data = {
  user: {
    name: "Bifrost User",
    email: "user@example.com",
    avatar: undefined,
  },
  mainItems: [
    {
      title: "Dashboard",
      url: "/",
      icon: BarChart3,
    },
    {
      title: "Liquid DOT",
      url: "/vdot",
      icon: Coins,
      items: [
        {
          title: "Mint vDOT",
          url: "/vdot/mint",
        },
        {
          title: "Redeem DOT",
          url: "/vdot/redeem",
        },
        {
          title: "My Positions",
          url: "/vdot/positions",
        },
      ],
    },
    {
      title: "Learn DeFi",
      url: "/guide",
      icon: GraduationCap,
      items: [
        {
          title: "DeFi Guide",
          url: "/guide",
        },
        {
          title: "Risks & Warnings",
          url: "/risks",
        },
        {
          title: "Glossary",
          url: "/resources/glossary",
        },
      ],
    },
    {
      title: "Yield Opportunities",
      url: "/resources/yield-farming",
      icon: Wallet,
      items: [
        {
          title: "Yield Farming",
          url: "/resources/yield-farming",
        },
        {
          title: "Liquid Staking",
          url: "/resources/liquid-staking",
        },
      ],
    },
    {
      title: "Resources",
      url: "/resources",
      icon: Globe,
      items: [
        {
          title: "Leaderboard",
          url: "/leaderboard",
        },
        {
          title: "Bifrost Finance",
          url: "https://bifrost.finance",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.mainItems} />
      </SidebarContent>
      <SidebarFooter className="text-xs p-4">
        © {new Date().getFullYear()} Dotheon
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
