import { Startplaats } from "@/app/types";

const apiUrl = "https://drone.ziasvannes.tech/api/startplaatsen";

async function getStartplaatsen(): Promise<Startplaats[]> {
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
        `Failed to fetch startplaatsen. Status: ${res.status}. Check server logs.`
      );
    }

    const data = await res.json();
    return data as Startplaats[];
  } catch (error) {
    console.error(`Error in getStartplaatsen:`, error);
    throw error;
  }
}

const handleDelete = async (id: number) => {
  if (!confirm(`Weet je zeker dat je startplaats ${id} wilt verwijderen?`))
    return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete startplaats");
    }

    window.location.reload();
  } catch (error) {
    console.error("Error deleting startplaats:", error);
    alert("Er is een fout opgetreden bij het verwijderen van de startplaats.");
  }
};

const handleAddStartplaats = async (
  formData: Startplaats,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: Startplaats) => void
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
        errorData.error || `Failed to add startplaats (${response.status})`
      );
    }

    setIsOpen(false);
    setFormData({
      locatie: "",
      isbeschikbaar: true,
    } as Startplaats);

    alert("Startplaats succesvol toegevoegd!");
    window.location.reload();
  } catch (error) {
    console.error("Error adding startplaats:", error);
    setError(
      error instanceof Error ? error.message : "Failed to add startplaats"
    );
  } finally {
    setIsLoading(false);
  }
};

const handleUpdateStartplaats = async (
  formData: Startplaats,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: Startplaats) => void
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
        errorData.error || `Failed to update startplaats (${response.status})`
      );
    }

    setIsOpen(false);
    setFormData({
      locatie: "",
      isbeschikbaar: true,
    } as Startplaats);

    alert("Startplaats succesvol bijgewerkt!");
    window.location.reload();
  } catch (error) {
    console.error("Error updating startplaats:", error);
    setError(
      error instanceof Error ? error.message : "Failed to update startplaats"
    );
  } finally {
    setIsLoading(false);
  }
};

export default {
  getStartplaatsen,
  handleDelete,
  handleAddStartplaats,
  handleUpdateStartplaats,
};
