"use client";

import type React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Fragment } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar-app/app-sidebar";
import AnnouncementBar from "@/components/announcement-bar";
import { SessionWhatsNewDialog } from "@/components/whatsnew-dialog/session-dialog";

function generateBreadcrumbs(pathname: string) {
  const paths = pathname.split("/").filter(Boolean);
  return paths.map((path, index) => {
    const href = "/" + paths.slice(0, index + 1).join("/");
    const label = path.charAt(0).toUpperCase() + path.slice(1);
    return {
      href,
      label,
      isCurrent: index === paths.length - 1,
    };
  });
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <div className="flex w-full min-h-screen">
      {/* What's New Dialog - Shows automatically on first session visit */}
      <SessionWhatsNewDialog version="1.0" showEachSession={true} />

      <AppSidebar />
      <div className="w-full">
        <div className="w-full py-2 px-4">
          <AnnouncementBar />
          <div className="flex items-center mb-4">
            <SidebarTrigger className="mr-2 shadow-none" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" className="flex items-center">
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {breadcrumbs.length > 0 && <BreadcrumbSeparator />}

                {breadcrumbs.map((breadcrumb, index) => (
                  <Fragment key={breadcrumb.href}>
                    <BreadcrumbItem>
                      {breadcrumb.isCurrent ? (
                        <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
