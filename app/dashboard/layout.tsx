"use client";

import React from "react";
import Header from "@/components/global/header";
import Footer from "@/components/global/footer";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();
  const isDashboardRoot = pathname === "/dashboard";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-8 lg:p-12">
        {!isDashboardRoot && (
          <Link href="/dashboard" className="p-6">
            <Button variant="secondary">Back to Dashboard</Button>
          </Link>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}
