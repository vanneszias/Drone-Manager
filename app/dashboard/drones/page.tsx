import React from 'react';
import { Drone } from '@/app/types';
import DroneList from '@/components/dashboard/drones/drone-list';
import { AddDroneDialog } from '@/components/dashboard/drones/add-drone-dialog';

// Function to fetch drones from your API
async function getDrones(): Promise<Drone[]> {
  // The url can be localhost or the server url
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5328';
  const apiUrl = `${url}/api/drones`;
  console.log(`Server-side fetch initiated for: ${apiUrl}`); // Add logging

  try {
    const res = await fetch(apiUrl, {
        cache: 'no-store', // Disable caching for dynamic data
        headers: { // Good practice
            'Accept': 'application/json',
        }
    });

    console.log(`Fetch response status from ${apiUrl}: ${res.status}`); // Log status

    if (!res.ok) {
      const errorText = await res.text(); // Get error body
      console.error(`Error fetching ${apiUrl}: ${res.status} ${res.statusText}`);
      console.error(`Response body: ${errorText.substring(0, 500)}...`); // Log response body
      // Throw an error to be caught by Next.js error handling (error.tsx)
      throw new Error(`Failed to fetch drones. Status: ${res.status}. Check server logs.`);
    }

    // Verify Content-Type before parsing
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
       const responseText = await res.text(); // Get body if not JSON
       console.error(`Expected JSON but received ${contentType} from ${apiUrl}`);
       console.error(`Response body: ${responseText.substring(0, 500)}...`);
       throw new Error(`API route ${apiUrl} did not return JSON. Received: ${contentType}`);
    }

    const data = await res.json();
    console.log(`Successfully fetched and parsed data from ${apiUrl}`);
    return data as Drone[];

  } catch (error) {
    console.error(`Error in getDrones fetching ${apiUrl}:`, error);
    // Re-throw the error so Next.js can handle it (e.g., show error.tsx)
    throw error;
  }
}

export default async function DronesPage() {
  try {
      const drones = await getDrones();

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