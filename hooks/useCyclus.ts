import { Cyclus } from "@/app/types";

const apiUrl = "https://drone.ziasvannes.tech/api/cycli";

async function getCycli(): Promise<Cyclus[]> {
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
        `Failed to fetch cycli. Status: ${res.status}. Check server logs.`
      );
    }

    const data = await res.json();
    return data as Cyclus[];
  } catch (error) {
    console.error(`Error in getCycli:`, error);
    throw error;
  }
}

const handleDelete = async (id: number) => {
  if (!confirm(`Weet je zeker dat je cyclus ${id} wilt verwijderen?`)) return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete cyclus");
    }

    window.location.reload();
  } catch (error) {
    console.error("Error deleting cyclus:", error);
    alert("Er is een fout opgetreden bij het verwijderen van de cyclus.");
  }
};

const handleAddCyclus = async (
  formData: Cyclus,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: Cyclus) => void
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
        startuur: formData.startuur,
        tijdstip: formData.tijdstip,
        vluchtcyclus_id: formData.vluchtcyclus_id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to add cyclus (${response.status})`);
    }

    setIsOpen(false);
    setFormData({} as Cyclus);

    alert("Cyclus succesvol toegevoegd!");
    window.location.reload();
  } catch (error) {
    console.error("Error adding cyclus:", error);
    setError(error instanceof Error ? error.message : "Failed to add cyclus");
  } finally {
    setIsLoading(false);
  }
};

const handleUpdateCyclus = async (
  formData: Cyclus,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: Cyclus) => void
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
        startuur: formData.startuur,
        tijdstip: formData.tijdstip,
        vluchtcyclus_id: formData.vluchtcyclus_id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to update cyclus (${response.status})`);
    }

    setIsOpen(false);
    setFormData({} as Cyclus);

    alert("Cyclus succesvol bijgewerkt!");
    window.location.reload();
  } catch (error) {
    console.error("Error updating cyclus:", error);
    setError(error instanceof Error ? error.message : "Failed to update cyclus");
  } finally {
    setIsLoading(false);
  }
};

export default {
  getCycli,
  handleDelete,
  handleAddCyclus,
  handleUpdateCyclus,
};
