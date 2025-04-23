"use client";

import { useState, useEffect } from 'react';
import { DockingCyclus } from '@/app/types';

const apiUrl = 'https://drone.ziasvannes.tech/api/docking-cyclus';

// Function to fetch docking cyclus from your API
async function getDockingCyclus(): Promise<DockingCyclus[]> {
  console.log(`Server-side fetch initiated for: ${apiUrl}`);

  try {
    const res = await fetch(apiUrl, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Error fetching ${apiUrl}: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch docking cyclus. Server responded with: ${res.status} - ${res.statusText}`);
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Expected JSON response but received: ${contentType}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in getDockingCyclus:", error);
    throw new Error("Unable to fetch docking cyclus. Please try again later.");
  }
}

function useDockingCyclus() {
  const [dockingCyclus, setDockingCyclus] = useState<DockingCyclus[]>([]);

  const fetchDockingCyclus = async () => {
    try {
      const data = await getDockingCyclus();
      setDockingCyclus(data);
    } catch (error) {
      console.error("Failed to fetch docking cyclus:", error);
    }
  };

  return {
    dockingCyclus,
    fetchDockingCyclus,
  };
}

export default useDockingCyclus;
