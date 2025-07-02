"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Network,
  Plug,
  PlugZap,
  Sparkles,
  Wallet,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAccount, useDisconnect } from "wagmi";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { getWalletName, truncateAddress } from "@/lib/utils";
import Link from "next/link";
import CopyButton from "../copy-button";

export default function NavUser() {
  const { isMobile } = useSidebar();
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const { isConnected, address, connector, chain } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {isConnected && address ? (
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg" className="">
                <WalletAvatar address={address} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {truncateAddress(address)}
                  </span>
                  <span className="truncate text-xs">
                    {getWalletName(connector)}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          ) : (
            <SidebarMenuButton
              onClick={() => openConnectModal?.()}
              size="lg"
              className="group/nav data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground/90"
            >
              <Avatar className="size-8 rounded-lg flex items-center justify-center ">
                <div className="relative z-10 size-6 overflow-hidden flex items-center justify-center ">
                  <PlugZap className="-z-10 absolute opacity-100 scale-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover/nav:-translate-y-5 group-hover/nav:translate-x-5 group-hover/nav:opacity-0 group-hover/nav:scale-0 transition-all duration-200" />
                  <PlugZap className="absolute -z-10 -bottom-4 -left-4 opacity-0 scale-0 group-hover/nav:-translate-y-[15px] group-hover/nav:translate-x-4 group-hover/nav:opacity-100 group-hover/nav:scale-100 transition-all duration-200" />
                </div>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold">Connect Wallet</span>
              </div>
            </SidebarMenuButton>
          )}
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="flex items-center gap-2 w-full">
                  <WalletAvatar address={address!} />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {truncateAddress(address!)}
                    </span>
                    <span className="truncate text-xs">
                      {getWalletName(connector)}
                    </span>
                  </div>
                  <CopyButton copyText={address!} />
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => openChainModal?.()}>
                <Plug />
                Current Network : {chain?.name}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/portfolio-manager">
                  <Wallet />
                  Portfolio Manager
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => disconnect()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

const WalletAvatar = ({ address }: { address: string }) => {
  return (
    <Avatar className="size-8 rounded-lg">
      <AvatarImage
        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${
          address + "dotheon"
        }`}
        alt={`avatar of wallet ${address}`}
      />
      <AvatarFallback className="rounded-lg">
        {truncateAddress(address)}
      </AvatarFallback>
    </Avatar>
  );
};
