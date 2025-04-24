import { VluchtCyclus } from "@/app/types";

const apiUrl = "https://drone.ziasvannes.tech/api/vlucht-cycli";

async function getVluchtCycli(): Promise<VluchtCyclus[]> {
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
        `Failed to fetch vlucht cycli. Status: ${res.status}. Check server logs.`
      );
    }

    const data = await res.json();
    return data as VluchtCyclus[];
  } catch (error) {
    console.error(`Error in getVluchtCycli:`, error);
    throw error;
  }
}

const handleDelete = async (id: number) => {
  if (!confirm(`Weet je zeker dat je vlucht cyclus ${id} wilt verwijderen?`))
    return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete vlucht cyclus");
    }

    window.location.reload();
  } catch (error) {
    console.error("Error deleting vlucht cyclus:", error);
    alert(
      "Er is een fout opgetreden bij het verwijderen van de vlucht cyclus."
    );
  }
};

const handleAddVluchtCyclus = async (
  formData: VluchtCyclus,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: VluchtCyclus) => void
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
        VerslagId: formData.VerslagId,
        PlaatsId: formData.PlaatsId,
        DroneId: formData.DroneId,
        ZoneId: formData.ZoneId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to add vlucht cyclus (${response.status})`
      );
    }

    setIsOpen(false);
    setFormData({
      VerslagId: null,
      PlaatsId: null,
      DroneId: null,
      ZoneId: null,
    } as VluchtCyclus);

    alert("Vlucht cyclus succesvol toegevoegd!");
    window.location.reload();
  } catch (error) {
    console.error("Error adding vlucht cyclus:", error);
    setError(
      error instanceof Error ? error.message : "Failed to add vlucht cyclus"
    );
  } finally {
    setIsLoading(false);
  }
};

export default {
  getVluchtCycli,
  handleDelete,
  handleAddVluchtCyclus,
};
