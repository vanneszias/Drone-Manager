import React from "react";
import Header from "@/components/global/header"; // Or a new DashboardHeader
import Footer from "@/components/global/footer"; // Or remove if dashboard doesn't need it

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if the current route is the root of the dashboard
  const isDashboardRoot =
    typeof window !== "undefined" && window.location.pathname === "/dashboard";

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
