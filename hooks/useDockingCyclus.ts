"use client";

import { useState, useEffect } from "react";
import { DockingCyclus } from "@/app/types";

const apiUrl = "https://drone.ziasvannes.tech/api/docking-cyclus";

// Function to fetch docking cyclus from your API
async function getDockingCyclus(): Promise<DockingCyclus[]> {
  console.log(`Server-side fetch initiated for: ${apiUrl}`);

  try {
    const res = await fetch(apiUrl, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `Error fetching ${apiUrl}: ${res.status} ${res.statusText}`
      );
      throw new Error(
        `Failed to fetch docking cyclus. Server responded with: ${res.status} - ${res.statusText}`
      );
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

async function createDockingCyclus(
  dockingCyclus: DockingCyclus
): Promise<DockingCyclus> {
  console.log(`Server-side fetch initiated for: ${apiUrl}`);
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(dockingCyclus),
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `Error fetching ${apiUrl}: ${res.status} ${res.statusText}`
      );
      throw new Error(
        `Failed to create docking cyclus. Server responded with: ${res.status} - ${res.statusText}`
      );
    }
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Expected JSON response but received: ${contentType}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error in createDockingCyclus:", error);
    throw new Error("Unable to create docking cyclus. Please try again later.");
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

  const handleAddDockingCyclus = async (
    newDockingCyclus: DockingCyclus,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setFormData: React.Dispatch<React.SetStateAction<DockingCyclus>>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const createdDockingCyclus = await createDockingCyclus(newDockingCyclus);
      setDockingCyclus((prev) => [...prev, createdDockingCyclus]);
      setIsOpen(false);
      setFormData({
        locatie: "",
        capaciteit: 0,
        status: "AVAILABLE",
      } as DockingCyclus);
    } catch (error) {
      console.error("Failed to create docking cyclus:", error);
      setError("Failed to create docking cyclus. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDockingCyclus();
  }, []);

  return {
    dockingCyclus,
    fetchDockingCyclus,
    handleAddDockingCyclus,
  };
}

export default useDockingCyclus;
