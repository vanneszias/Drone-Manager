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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="flex flex-1">
        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0 animate-gradient-xy">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-green-500 to-sky-400 opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 via-pink-500 to-red-500 opacity-10 mix-blend-overlay" />
        </div>

        <aside className="relative z-10 w-64 glass-effect border-r border-white/20">
          <nav className="p-6 space-y-3">
            <Link
              href="/dashboard"
              className={`block p-2 rounded-lg transition-all duration-200 ${
                pathname === "/dashboard"
                  ? "glass-effect-strong text-white font-medium"
                  : "text-white/90 hover:glass-effect hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/event"
              className={`block p-2 rounded-lg transition-all duration-200 ${
                pathname === "/dashboard/event"
                  ? "glass-effect-strong text-white font-medium"
                  : "text-white/90 hover:glass-effect hover:text-white"
              }`}
            >
              Events
            </Link>
            <Link
              href="/dashboard/startplaats"
              className={`block p-2 rounded-lg transition-all duration-200 ${
                pathname === "/dashboard/startplaats"
                  ? "glass-effect-strong text-white font-medium"
                  : "text-white/90 hover:glass-effect hover:text-white"
              }`}
            >
              Start Places
            </Link>
            <Link
              href="/dashboard/drones"
              className={`block p-2 rounded-lg transition-all duration-200 ${
                pathname === "/dashboard/drones"
                  ? "glass-effect-strong text-white font-medium"
                  : "text-white/90 hover:glass-effect hover:text-white"
              }`}
            >
              Drones
            </Link>
            <Link
              href="/dashboard/dockings"
              className={`block p-2 rounded-lg transition-all duration-200 ${
                pathname === "/dashboard/dockings"
                  ? "glass-effect-strong text-white font-medium"
                  : "text-white/90 hover:glass-effect hover:text-white"
              }`}
            >
              Dockings
            </Link>
            <Link
              href="/dashboard/cyclus"
              className={`block p-2 rounded-lg transition-all duration-200 ${
                pathname === "/dashboard/cyclus"
                  ? "glass-effect-strong text-white font-medium"
                  : "text-white/90 hover:glass-effect hover:text-white"
              }`}
            >
              Cyclus
            </Link>
            <Link
              href="/dashboard/zones"
              className={`block p-2 rounded-lg transition-all duration-200 ${
                pathname === "/dashboard/zones"
                  ? "glass-effect-strong text-white font-medium"
                  : "text-white/90 hover:glass-effect hover:text-white"
              }`}
            >
              Zones
            </Link>
            <Link
              href="/dashboard/dockingcyclus"
              className={`block p-2 rounded-lg transition-all duration-200 ${
                pathname === "/dashboard/dockingcyclus"
                  ? "glass-effect-strong text-white font-medium"
                  : "text-white/90 hover:glass-effect hover:text-white"
              }`}
            >
              Docking Cyclus
            </Link>
            <Link
              href="/dashboard/verslag"
              className={`block p-2 rounded-lg transition-all duration-200 ${
                pathname === "/dashboard/verslag"
                  ? "glass-effect-strong text-white font-medium"
                  : "text-white/90 hover:glass-effect hover:text-white"
              }`}
            >
              Reports
            </Link>
            <Link
              href="/dashboard/vluchtcyclus"
              className={`block p-2 rounded-lg transition-all duration-200 ${
                pathname === "/dashboard/vluchtcyclus"
                  ? "glass-effect-strong text-white font-medium"
                  : "text-white/90 hover:glass-effect hover:text-white"
              }`}
            >
              Flight Cycles
            </Link>
          </nav>
        </aside>
        <main className="relative z-10 flex-1 p-4 md:p-8 lg:p-12 glass-effect">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
