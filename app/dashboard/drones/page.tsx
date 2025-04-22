import React from 'react';
import DroneList from '@/components/dashboard/drones/drone-list';
import { AddDroneDialog } from '@/components/dashboard/drones/add-drone-dialog';
import useDrones from '@/hooks/useDrones';

export default async function DronesPage() {
  try {
      const drones = await useDrones.getDrones();

      return (
        <div className="container mx-auto py-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Drone Management</h1>
            <AddDroneDialog />
          </div>
          {/* Pass the fetched drones to the client component */}
          <DroneList drones={drones} />
        </div>
      );
  } catch (error) {
      // Basic error display if getDrones fails and you don't have error.tsx
      // Note: An error.tsx file is the recommended way to handle this
      console.error("Error rendering DronesPage:", error);
      return (
          <div className="container mx-auto py-10 text-center text-red-500">
              <h1 className="text-2xl font-bold mb-4">Error Loading Drones</h1>
              <p>{error instanceof Error ? error.message : "An unknown error occurred."}</p>
              <p>Please check the console logs for more details.</p>
          </div>
      );
  }
}