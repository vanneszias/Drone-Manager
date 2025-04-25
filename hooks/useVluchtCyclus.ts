const apiUrl = "https://drone.ziasvannes.tech/api/vlucht-cycli";
const plaatsApiUrl = "https://drone.ziasvannes.tech/api/startplaatsen";
const droneApiUrl = "https://drone.ziasvannes.tech/api/drones";
const zoneApiUrl = "https://drone.ziasvannes.tech/api/zones";
const verslagApiUrl = "https://drone.ziasvannes.tech/api/verslagen";

async function getVluchtCycli() {
  try {
    const res = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch vlucht cycli. Status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in getVluchtCycli:", error);
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

    return await res.json();
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

    return await res.json();
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

    return await res.json();
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

    return await res.json();
  } catch (error) {
    console.error("Error fetching verslagen:", error);
    throw error;
  }
}

const handleDelete = async (id: number) => {
  if (!confirm("Weet je zeker dat je deze vluchtcyclus wilt verwijderen?"))
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
      if (errorData.error?.toLowerCase().includes("in progress")) {
        alert("Kan geen vluchtcyclus verwijderen die in uitvoering is.");
        return;
      }
      if (errorData.error?.toLowerCase().includes("references exist")) {
        alert(
          "Deze vluchtcyclus kan niet worden verwijderd omdat deze nog in gebruik is."
        );
        return;
      }
      throw new Error(errorData.error || "Failed to delete vlucht cyclus");
    }

    window.location.reload();
  } catch (error) {
    console.error("Error deleting vlucht cyclus:", error);
    alert(
      error instanceof Error ? error.message : "Er is een fout opgetreden."
    );
  }
};

const handleCreateVluchtCyclus = async (
  droneId: number,
  plaatsId: number,
  zoneId: number | null,
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (open: boolean) => void,
  resetForm: () => void
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
        DroneId: droneId,
        PlaatsId: plaatsId,
        ZoneId: zoneId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to create vlucht cyclus (${response.status})`
      );
    }

    setIsOpen(false);
    resetForm();
    window.location.reload();
  } catch (error) {
    console.error("Error creating vlucht cyclus:", error);
    setError(
      error instanceof Error ? error.message : "Failed to create vlucht cyclus"
    );
  } finally {
    setIsLoading(false);
  }
};

const handleUpdateStatus = async (
  id: number,
  newStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED",
  setError: (error: string | null) => void
) => {
  try {
    const response = await fetch(`${apiUrl}/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to update status (${response.status})`
      );
    }

    window.location.reload();
  } catch (error) {
    console.error("Error updating vlucht cyclus status:", error);
    setError(
      error instanceof Error ? error.message : "Failed to update status"
    );
  }
};

const handleAttachVerslag = async (
  vluchtCyclusId: number,
  verslagId: number,
  setError: (error: string | null) => void
) => {
  try {
    const response = await fetch(`${apiUrl}/${vluchtCyclusId}/verslag`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ verslagId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to attach verslag (${response.status})`
      );
    }

    window.location.reload();
  } catch (error) {
    console.error("Error attaching verslag:", error);
    setError(
      error instanceof Error ? error.message : "Failed to attach verslag"
    );
  }
};

export default {
  getVluchtCycli,
  handleDelete,
  handleCreateVluchtCyclus,
  handleUpdateStatus,
  handleAttachVerslag,
  getPlaces,
  getDrones,
  getZones,
  getVerslagen,
};
