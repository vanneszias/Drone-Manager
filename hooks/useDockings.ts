import { Docking } from "@/app/types";

const apiUrl = "https://drone.ziasvannes.tech/api/dockings";

async function getDockings(): Promise<Docking[]> {
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
        `Failed to fetch dockings. Status: ${res.status}. Check server logs.`
      );
    }

    const data = await res.json();
    return data as Docking[];
  } catch (error) {
    console.error(`Error in getDockings:`, error);
    throw error;
  }
}

const handleDelete = async (id: number) => {
  if (!confirm(`Weet je zeker dat je docking ${id} wilt verwijderen?`)) return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete docking");
    }

    window.location.reload();
  } catch (error) {
    console.error("Error deleting docking:", error);
    alert("Er is een fout opgetreden bij het verwijderen van de docking.");
  }
};

const handleAddDocking = async (
  formData: Docking,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: Docking) => void
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
        locatie: formData.locatie,
        isbeschikbaar: formData.isbeschikbaar,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to add docking (${response.status})`
      );
    }

    setIsOpen(false);
    setFormData({
      locatie: "",
      isbeschikbaar: true,
    } as Docking);

    alert("Docking succesvol toegevoegd!");
    window.location.reload();
  } catch (error) {
    console.error("Error adding docking:", error);
    setError(error instanceof Error ? error.message : "Failed to add docking");
  } finally {
    setIsLoading(false);
  }
};

const handleUpdateDocking = async (
  formData: Docking,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: Docking) => void
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
        locatie: formData.locatie,
        isbeschikbaar: formData.isbeschikbaar,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to update docking (${response.status})`
      );
    }

    setIsOpen(false);
    setFormData({
      locatie: "",
      isbeschikbaar: true,
    } as Docking);

    alert("Docking succesvol bijgewerkt!");
    window.location.reload();
  } catch (error) {
    console.error("Error updating docking:", error);
    setError(
      error instanceof Error ? error.message : "Failed to update docking"
    );
  } finally {
    setIsLoading(false);
  }
};

export default {
  getDockings,
  handleDelete,
  handleAddDocking,
  handleUpdateDocking,
};
