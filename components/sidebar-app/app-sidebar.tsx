"use client";

import * as React from "react";
import {
  BarChart3,
  Globe,
  Settings,
  Wallet,
  Coins,
  GraduationCap,
  Brain,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "./logo";
import NavUser from "./nav-user";
import NavMain from "./nav-main";
import Marketing from "./marketing";

// Updated data for Bifrost DeFi Dashboard
const data = {
  mainItems: [
    {
      title: "Dashboard",
      url: "/",
      icon: BarChart3,
    },
    {
      title: "Liquid Tokens",
      url: "/vtokens",
      icon: Coins,
      items: [
        {
          title: "Mint vTokens",
          url: "/vtokens/mint",
        },
        {
          title: "Redeem vTokens",
          url: "/vtokens/redeem",
        },
      ],
    },
    {
      title: "Wallet",
      url: "/wallet",
      icon: Wallet,
    },
    {
      title: "AI DeFi Assistant",
      url: "/ai",
      icon: Brain,
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
  const { open } = useSidebar();
  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.mainItems} />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        {open && <Marketing />}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
