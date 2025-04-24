import { Drone } from "@/app/types";

const apiUrl = "https://drone.ziasvannes.tech/api/drones";

async function getDrones(): Promise<Drone[]> {
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
        `Failed to fetch drones. Status: ${res.status}. Check server logs.`
      );
    }

    const data = await res.json();
    return data as Drone[];
  } catch (error) {
    console.error(`Error in getDrones:`, error);
    throw error;
  }
}

const handleDelete = async (id: number) => {
  if (!confirm(`Weet je zeker dat je drone ${id} wilt verwijderen?`)) return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete drone");
    }

    window.location.reload();
  } catch (error) {
    console.error("Error deleting drone:", error);
    alert("Er is een fout opgetreden bij het verwijderen van de drone.");
  }
};

const handleAddDrone = async (
  formData: Drone,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: Drone) => void
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
        status: formData.status,
        batterij: formData.batterij,
        magOpstijgen: formData.magOpstijgen,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to add drone (${response.status})`
      );
    }

    setIsOpen(false);
    setFormData({
      status: "AVAILABLE",
      batterij: 100,
      magOpstijgen: true,
    } as Drone);

    alert("Drone succesvol toegevoegd!");
    window.location.reload();
  } catch (error) {
    console.error("Error adding drone:", error);
    setError(error instanceof Error ? error.message : "Failed to add drone");
  } finally {
    setIsLoading(false);
  }
};

const handleUpdateDrone = async (
  formData: Drone,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: Drone) => void
) => {
  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch(`${apiUrl}/${formData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        status: formData.status,
        batterij: formData.batterij,
        magOpstijgen: formData.magOpstijgen,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to update drone (${response.status})`
      );
    }

    setIsOpen(false);
    setFormData({
      status: "AVAILABLE",
      batterij: 100,
      magOpstijgen: true,
    } as Drone);

    alert("Drone succesvol bijgewerkt!");
    window.location.reload();
  } catch (error) {
    console.error("Error updating drone:", error);
    setError(error instanceof Error ? error.message : "Failed to update drone");
  } finally {
    setIsLoading(false);
  }
};

export default {
  getDrones,
  handleDelete,
  handleAddDrone,
  handleUpdateDrone,
};
