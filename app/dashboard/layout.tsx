import React from 'react';
import Header from '@/components/global/header'; // Or a new DashboardHeader
import Footer from '@/components/global/footer'; // Or remove if dashboard doesn't need it

// Optional: Create a simple sidebar component later if needed
// import Sidebar from '@/components/dashboard/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <aside className="w-64 border-r p-4 hidden md:block">
          <nav>
            {/* Navigation Links */}
            <a href='/dashboard/zones' className="block py-2 px-4 hover:bg-muted rounded">Zones</a>
            <a href="/dashboard/drones" className="block py-2 px-4 hover:bg-muted rounded">Drones</a>
            {/* ... other links ... */}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}