import { DockingCyclus } from "@/app/types";

const apiUrl = "https://drone.ziasvannes.tech/api/docking-cycli";

async function getDockingCycli(): Promise<DockingCyclus[]> {
  console.log(`Server-side fetch initiated for: ${apiUrl}`);

  try {
    const res = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    console.log(`Fetch response status from ${apiUrl}: ${res.status}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `Error fetching ${apiUrl}: ${res.status} ${res.statusText}`
      );
      console.error(`Response body: ${errorText.substring(0, 500)}...`);
      throw new Error(
        `Failed to fetch docking cycli. Status: ${res.status}. Check server logs.`
      );
    }

    const data = await res.json();
    return data as DockingCyclus[];
  } catch (error) {
    console.error(`Error in getDockingCycli:`, error);
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
        DroneId: formData.DroneId,
        DockingId: formData.DockingId,
        CyclusId: formData.CyclusId,
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

const handleUpdateCyclus = async (
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
        DroneId: formData.DroneId,
        DockingId: formData.DockingId,
        CyclusId: formData.CyclusId,
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

    alert("Docking cyclus succesvol bijgewerkt!");
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
        docking_id: formData.DockingId,
        drone_id: formData.DroneId,
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
      DockingId: 0,
      DroneId: 0,
      CyclusId: 0,
    } as DockingCyclus);

    alert("Docking cycle successfully updated!");
    window.location.reload();
  } catch (error) {
    console.error("Error updating docking cyclus:", error);
    setError(
      error instanceof Error ? error.message : "Failed to update docking cycle"
    );
  } finally {
    setIsLoading(false);
  }
};

export default {
  getDockingCycli,
  handleDelete,
  handleAddDockingCyclus,
  handleUpdateCyclus,
  handleUpdateDockingCyclus,
};
