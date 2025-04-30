"use client";

import * as React from "react";
import {
  BarChart3,
  BookOpen,
  ExternalLink,
  Globe,
  Info,
  Trophy,
  User,
  Wallet,
  Command,
  GalleryVerticalEnd,
  AudioWaveform,
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
      title: "DeFi Guide",
      url: "/guide",
      icon: BookOpen,
    },
    {
      title: "Leaderboard",
      url: "/leaderboard",
      icon: Trophy,
    },
  ],
  resources: [
    {
      title: "Resources",
      url: "/resources",
      icon: Globe,
      items: [
        {
          title: "Glossary",
          url: "/resources/glossary",
        },
        {
          title: "Yield Farming",
          url: "/resources/yield-farming",
        },
        {
          title: "Liquid Staking",
          url: "/resources/liquid-staking",
        },
        {
          title: "Bifrost Finance",
          url: "https://bifrost.finance",
          external: true,
        },
      ],
    },
  ],
  risks: [
    {
      title: "Risks & Warnings",
      url: "/app/risks",
      icon: Info,
      items: [
        {
          title: "General Risks",
          url: "/app/risks/general",
        },
        {
          title: "Protocol Risks",
          url: "/app/risks/protocol",
        },
        {
          title: "Security",
          url: "/app/risks/security",
        },
      ],
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
        <NavMain collapsibleItems={data.resources} />
        <NavMain collapsibleItems={data.risks} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
