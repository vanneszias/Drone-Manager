import { VluchtCyclus } from "@/app/types";

const apiUrl = "https://drone.ziasvannes.tech/api/vlucht-cycli";
const plaatsApiUrl = "https://drone.ziasvannes.tech/api/startplaatsen";
const droneApiUrl = "https://drone.ziasvannes.tech/api/drones";
const zoneApiUrl = "https://drone.ziasvannes.tech/api/zones";
const verslagApiUrl = "https://drone.ziasvannes.tech/api/verslagen";

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

async function getPlaces() {
  try {
    const res = await fetch(plaatsApiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch places. Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching places:", error);
    throw error;
  }
}

async function getDrones() {
  try {
    const res = await fetch(droneApiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch drones. Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching drones:", error);
    throw error;
  }
}

async function getZones() {
  try {
    const res = await fetch(zoneApiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch zones. Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching zones:", error);
    throw error;
  }
}

async function getVerslagen() {
  try {
    const res = await fetch(verslagApiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch verslagen. Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching verslagen:", error);
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
      const errorData = await res.json();
      console.error("Delete vlucht cyclus error details:", errorData);

      if (errorData.error?.toLowerCase().includes("references exist")) {
        alert(
          "Deze vluchtcyclus kan niet worden verwijderd omdat deze nog in gebruik is door andere onderdelen van het systeem."
        );
        return;
      }

      throw new Error(errorData.error || "Failed to delete vlucht cyclus");
    }

    window.location.reload();
  } catch (error) {
    console.error("Error deleting vlucht cyclus:", error);
    alert(
      error instanceof Error
        ? error.message
        : "Er is een fout opgetreden bij het verwijderen van de vlucht cyclus."
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

  // Validate at least one field is set
  if (
    !formData.VerslagId &&
    !formData.PlaatsId &&
    !formData.DroneId &&
    !formData.ZoneId
  ) {
    setError(
      "Je moet minstens één optie selecteren (Verslag, Plaats, Drone of Zone)."
    );
    setIsLoading(false);
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        VerslagId: formData.VerslagId || null,
        PlaatsId: formData.PlaatsId || null,
        DroneId: formData.DroneId || null,
        ZoneId: formData.ZoneId || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.error ||
        `Fout bij het toevoegen van vluchtcyclus (${response.status})`;

      // Map specific backend errors to user-friendly messages
      if (
        errorMessage.includes("Drone with ID") &&
        errorMessage.includes("does not exist")
      ) {
        throw new Error("De geselecteerde drone bestaat niet meer.");
      } else if (
        errorMessage.includes("Zone with ID") &&
        errorMessage.includes("does not exist")
      ) {
        throw new Error("De geselecteerde zone bestaat niet meer.");
      } else if (
        errorMessage.includes("Startplaats with ID") &&
        errorMessage.includes("does not exist")
      ) {
        throw new Error("De geselecteerde startplaats bestaat niet meer.");
      } else if (
        errorMessage.includes("Verslag with ID") &&
        errorMessage.includes("does not exist")
      ) {
        throw new Error("Het geselecteerde verslag bestaat niet meer.");
      } else {
        throw new Error(errorMessage);
      }
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

const handleUpdateVluchtCyclus = async (
  formData: VluchtCyclus,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: VluchtCyclus) => void
) => {
  setIsLoading(true);
  setError(null);

  try {
    // Validate that at least one field will be set
    if (
      !formData.VerslagId &&
      !formData.PlaatsId &&
      !formData.DroneId &&
      !formData.ZoneId
    ) {
      setError(
        "Je moet minstens één optie selecteren (Verslag, Plaats, Drone of Zone)."
      );
      setIsLoading(false);
      return;
    }

    const updateData = {
      VerslagId: formData.VerslagId || null,
      PlaatsId: formData.PlaatsId || null,
      DroneId: formData.DroneId || null,
      ZoneId: formData.ZoneId || null,
    };

    console.log("Updating vluchtcyclus with data:", updateData);

    const response = await fetch(`${apiUrl}/${formData.Id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Update vluchtcyclus error details:", errorData);
      const errorMessage =
        errorData.error ||
        `Fout bij het bijwerken van vluchtcyclus (${response.status})`;

      // Map specific backend errors to user-friendly messages
      if (
        errorMessage.includes("Drone with ID") &&
        errorMessage.includes("does not exist")
      ) {
        throw new Error("De geselecteerde drone bestaat niet meer.");
      } else if (
        errorMessage.includes("Zone with ID") &&
        errorMessage.includes("does not exist")
      ) {
        throw new Error("De geselecteerde zone bestaat niet meer.");
      } else if (
        errorMessage.includes("Startplaats with ID") &&
        errorMessage.includes("does not exist")
      ) {
        throw new Error("De geselecteerde startplaats bestaat niet meer.");
      } else if (
        errorMessage.includes("Verslag with ID") &&
        errorMessage.includes("does not exist")
      ) {
        throw new Error("Het geselecteerde verslag bestaat niet meer.");
      } else if (errorMessage.includes("at least one ID must remain set")) {
        throw new Error(
          "Je moet minstens één optie selecteren (Verslag, Plaats, Drone of Zone)."
        );
      } else {
        throw new Error(errorMessage);
      }
    }

    setIsOpen(false);
    setFormData({} as VluchtCyclus);

    alert("Vluchtcyclus succesvol bijgewerkt!");
    window.location.reload();
  } catch (error) {
    console.error("Error updating vluchtcyclus:", error);
    setError(
      error instanceof Error ? error.message : "Kon vluchtcyclus niet bijwerken"
    );
  } finally {
    setIsLoading(false);
  }
};

export default {
  getVluchtCycli,
  handleDelete,
  handleAddVluchtCyclus,
  handleUpdateVluchtCyclus,
  getPlaces,
  getDrones,
  getZones,
  getVerslagen,
};
