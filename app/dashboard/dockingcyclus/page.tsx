import React from 'react';
import DockingCyclusList from '@/components/dashboard/dockingcyclus/dockingcyclus-list';
import { AddDockingCyclusDialog } from '@/components/dashboard/dockingcyclus/add-dockingcyclus-dialog';
import useDockingCyclus from '@/hooks/useDockingCyclus';

export default async function DockingCyclusPage() {
  try {
    const dockingcycli = await useDockingCyclus.getDockingCycli();

    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Docking Cyclus Management</h1>
          <AddDockingCyclusDialog />
        </div>
        {/* Pass the fetched dockingcycli to the client component */}
        <DockingCyclusList dockingCycli={dockingcycli} />
      </div>
    );
  } catch (error) {
    // Basic error display if getDockingCycli fails and you don't have error.tsx
    console.error("Error rendering DockingCyclusPage:", error);
    return (
      <div className="container mx-auto py-10 text-center text-red-500">
        <h1 className="text-2xl font-bold mb-4">Error Loading Docking Cycli</h1>
        <p>{error instanceof Error ? error.message : "An unknown error occurred."}</p>
        <p>Please check the console logs for more details.</p>
      </div>
    );
  }
}