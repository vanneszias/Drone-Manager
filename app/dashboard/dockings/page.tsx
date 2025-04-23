import React from "react";
import DockingList from "@/components/dashboard/dockings/docking-list";
import { AddDockingDialog } from "@/components/dashboard/dockings/add-dockings-dialog";
import useDockings from "@/hooks/useDockings";

export default async function DockingsPage() {
  try {
    const dockings = await useDockings.getDockings();

    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Docking Management</h1>
          <AddDockingDialog />
        </div>
        {/* Pass the fetched dockings to the client component */}
        <DockingList dockings={dockings} />
      </div>
    );
  } catch (error) {
    // Basic error display if getDockings fails and you don't have error.tsx
    // Note: An error.tsx file is the recommended way to handle this
    console.error("Error rendering DockingsPage:", error);
    return (
      <div className="container mx-auto py-10 text-center text-red-500">
        <h1 className="text-2xl font-bold mb-4">Error Loading Dockings</h1>
        <p>{error instanceof Error ? error.message : "An unknown error occurred."}</p>
        <p>Please check the console logs for more details.</p>
      </div>
    );
  }
}