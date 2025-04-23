import React from 'react';
import ZoneList from '@/components/dashboard/zones/zone-list';
import { AddZoneDialog } from '@/components/dashboard/zones/add-zone-dialog';
import useZones from '@/hooks/useZones';

export default async function ZonesPage() {
  try {
    // Direct server-side data fetching
    const zones = await useZones.getZones();

    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Zone Management</h1>
          <AddZoneDialog />
        </div>
        <ZoneList zones={zones} />
      </div>
    );
  } catch (error) {
    console.error("Error rendering ZonesPage:", error);
    return (
      <div className="container mx-auto py-10 text-center text-red-500">
        <h1 className="text-2xl font-bold mb-4">Error Loading Zones</h1>
        <p>{error instanceof Error ? error.message : "An unknown error occurred."}</p>
        <p>Please check the console logs for more details.</p>
      </div>
    );
  }
}