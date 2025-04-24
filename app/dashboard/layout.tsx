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
      <main className="flex-1 p-4 md:p-8">
        {!isDashboardRoot && (
          <div className="mb-4">
            <Link href="/dashboard">
              <Button variant="outline">← Back to Dashboard</Button>
            </Link>
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}
