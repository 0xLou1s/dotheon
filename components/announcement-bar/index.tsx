import React from "react";
import StartHighlight from "./start-highlight";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

export default function AnnouncementBar() {
  return (
    <div className="relative flex items-center justify-between bg-foreground mb-2 px-6 py-[0.60rem] rounded-xs lg:rounded-md text-[0.5rem] font-normal leading-5 text-primary-foreground lg:text-xs">
      <StartHighlight />
      <div className="absolute left-1/2 top-1/2 flex h-5 -translate-x-1/2 -translate-y-1/2 items-center gap-2 text-nowrap">
        <p className="font-normal">
          <span className="text-secondary">TESTNET</span> IS LIVE!
        </p>
        <Separator className="h-4 w-px" orientation="vertical" />
        <Link
          href="/about-testnet"
          className="flex items-center gap-2 text-nowrap text-primary-foreground"
        >
          Learn more about Testnets
          <IconArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <StartHighlight />
    </div>
  );
}
