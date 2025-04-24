import { DockingCyclus, Drone, Docking, Cyclus } from "@/app/types";

const apiUrl = "https://drone.ziasvannes.tech/api/docking-cycli";
const dronesApiUrl = "https://drone.ziasvannes.tech/api/drones";
const dockingsApiUrl = "https://drone.ziasvannes.tech/api/dockings";
const cyclusApiUrl = "https://drone.ziasvannes.tech/api/cycli";

async function getDockingCycli(): Promise<DockingCyclus[]> {
  try {
    const res = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch docking cycli. Status: ${res.status}`);
    }

    const data = await res.json();
    return data as DockingCyclus[];
  } catch (error) {
    console.error("Error in getDockingCycli:", error);
    throw error;
  }
}

async function getDrones(): Promise<Drone[]> {
  try {
    const res = await fetch(dronesApiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch drones. Status: ${res.status}`);
    }

    const data = await res.json();
    return data as Drone[];
  } catch (error) {
    console.error("Error in getDrones:", error);
    throw error;
  }
}

async function getDockings(): Promise<Docking[]> {
  try {
    const res = await fetch(dockingsApiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch dockings. Status: ${res.status}`);
    }

    const data = await res.json();
    return data as Docking[];
  } catch (error) {
    console.error("Error in getDockings:", error);
    throw error;
  }
}

async function getCycli(): Promise<Cyclus[]> {
  try {
    const res = await fetch(cyclusApiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch cycli. Status: ${res.status}`);
    }

    const data = await res.json();
    return data as Cyclus[];
  } catch (error) {
    console.error("Error in getCycli:", error);
    throw error;
  }
}

const handleDelete = async (id: number) => {
  if (!confirm(`Weet je zeker dat je docking cyclus ${id} wilt verwijderen?`))
    return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete docking cyclus");
    }

    window.location.reload();
  } catch (error) {
    console.error("Error deleting docking cyclus:", error);
    alert(
      "Er is een fout opgetreden bij het verwijderen van de docking cyclus."
    );
  }
};

const handleAddDockingCyclus = async (
  formData: DockingCyclus,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: DockingCyclus) => void
) => {
  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        drone_id: formData.DroneId,
        docking_id: formData.DockingId,
        cyclus_id: formData.CyclusId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to add docking cyclus (${response.status})`
      );
    }

    setIsOpen(false);
    setFormData({
      DroneId: 0,
      DockingId: 0,
      CyclusId: 0,
    } as DockingCyclus);

    alert("Docking cyclus succesvol toegevoegd!");
    window.location.reload();
  } catch (error) {
    console.error("Error adding docking cyclus:", error);
    setError(
      error instanceof Error ? error.message : "Failed to add docking cyclus"
    );
  } finally {
    setIsLoading(false);
  }
};

const handleUpdateDockingCyclus = async (
  formData: DockingCyclus,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: DockingCyclus) => void
) => {
  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch(`${apiUrl}/${formData.Id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        drone_id: formData.DroneId,
        docking_id: formData.DockingId,
        cyclus_id: formData.CyclusId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          `Failed to update docking cyclus (${response.status})`
      );
    }

    setIsOpen(false);
    setFormData({
      DroneId: 0,
      DockingId: 0,
      CyclusId: 0,
    } as DockingCyclus);

    alert("Docking cyclus successfully updated!");
    window.location.reload();
  } catch (error) {
    console.error("Error updating docking cyclus:", error);
    setError(
      error instanceof Error ? error.message : "Failed to update docking cyclus"
    );
  } finally {
    setIsLoading(false);
  }
};

export default {
  getDockingCycli,
  handleDelete,
  handleAddDockingCyclus,
  handleUpdateDockingCyclus,
  getDrones,
  getDockings,
  getCycli,
};
