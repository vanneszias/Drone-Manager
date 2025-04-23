import React from 'react';
import StartplaatsList from '@/components/dashboard/startplaats/startplaats-list';
import { AddStartplaatsDialog } from '@/components/dashboard/startplaats/add-startplaats-dialog';
import useStartplaats from '@/hooks/useStartplaats';

export default async function StartplaatsPage() {
  try {
    const startplaats = await useStartplaats.getStartplaats();

    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Startplaats Management</h1>
          <AddStartplaatsDialog />
        </div>
        {/* Pass the fetched startplaats to the client component */}
        <StartplaatsList startplaats={startplaats} />
      </div>
    );
  } catch (error) {
    console.error("Error rendering StartplaatsPage:", error);
    return (
      <div className="container mx-auto py-10 text-center text-red-500">
        <h1 className="text-2xl font-bold mb-4">Error Loading Startplaats</h1>
        <p>{error instanceof Error ? error.message : "An unknown error occurred."}</p>
        <p>Please check the console logs for more details.</p>
      </div>
    );
  }
}