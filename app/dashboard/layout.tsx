"use client";

import React from "react";
import Header from "@/components/global/header";
import Footer from "@/components/global/footer";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-100 border-r">
          <nav className="p-4 space-y-2">
            <Link
              href="/dashboard"
              className={`block p-2 rounded-lg ${
                pathname === "/dashboard"
                  ? "bg-gray-200 font-medium"
                  : "hover:bg-gray-200"
              }`}
            >
              Dashboard
            </Link>
			<Link
              href="/dashboard/event"
              className={`block p-2 rounded-lg ${
                pathname === "/dashboard/event"
                  ? "bg-gray-200 font-medium"
                  : "hover:bg-gray-200"
              }`}
            >
              Events
            </Link>
			<Link
              href="/dashboard/startplaats"
              className={`block p-2 rounded-lg ${
                pathname === "/dashboard/startplaats"
                  ? "bg-gray-200 font-medium"
                  : "hover:bg-gray-200"
              }`}
            >
              Start Places
            </Link>
			<Link
              href="/dashboard/drones"
              className={`block p-2 rounded-lg ${
                pathname === "/dashboard/drones"
                  ? "bg-gray-200 font-medium"
                  : "hover:bg-gray-200"
              }`}
            >
              Drones
            </Link>
			<Link
              href="/dashboard/dockings"
              className={`block p-2 rounded-lg ${
                pathname === "/dashboard/dockings"
                  ? "bg-gray-200 font-medium"
                  : "hover:bg-gray-200"
              }`}
            >
              Dockings
            </Link>
			<Link
              href="/dashboard/cyclus"
              className={`block p-2 rounded-lg ${
                pathname === "/dashboard/cyclus"
                  ? "bg-gray-200 font-medium"
                  : "hover:bg-gray-200"
              }`}
            >
              Cyclus
            </Link>
			<Link
              href="/dashboard/zones"
              className={`block p-2 rounded-lg ${
                pathname === "/dashboard/zones"
                  ? "bg-gray-200 font-medium"
                  : "hover:bg-gray-200"
              }`}
            >
              Zones
            </Link>
			<Link
              href="/dashboard/dockingcyclus"
              className={`block p-2 rounded-lg ${
                pathname === "/dashboard/dockingcyclus"
                  ? "bg-gray-200 font-medium"
                  : "hover:bg-gray-200"
              }`}
            >
              Docking Cyclus
            </Link>
			<Link
              href="/dashboard/verslag"
              className={`block p-2 rounded-lg ${
                pathname === "/dashboard/verslag"
                  ? "bg-gray-200 font-medium"
                  : "hover:bg-gray-200"
              }`}
            >
              Reports
            </Link>
			<Link
              href="/dashboard/vluchtcyclus"
              className={`block p-2 rounded-lg ${
                pathname === "/dashboard/vluchtcyclus"
                  ? "bg-gray-200 font-medium"
                  : "hover:bg-gray-200"
              }`}
            >
              Flight Cycles
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-8 lg:p-12">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
