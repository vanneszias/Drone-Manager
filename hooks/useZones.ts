import { Zone, Event } from "@/app/types";

const apiUrl = "https://drone.ziasvannes.tech/api/zones";
const eventsApiUrl = "https://drone.ziasvannes.tech/api/events";

async function getZones(): Promise<Zone[]> {
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
        `Failed to fetch zones. Status: ${res.status}. Check server logs.`
      );
    }

    const data = await res.json();
    return data as Zone[];
  } catch (error) {
    console.error(`Error in getZones:`, error);
    throw error;
  }
}

const handleDelete = async (id: number) => {
  if (!confirm(`Weet je zeker dat je zone ${id} wilt verwijderen?`)) return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Delete zone error details:", errorData);

      if (
        errorData.error?.toLowerCase().includes("references exist") ||
        errorData.error?.toLowerCase().includes("in use")
      ) {
        alert(
          "Deze zone kan niet worden verwijderd omdat deze nog in gebruik is (bijvoorbeeld door vluchtcycli)."
        );
        return;
      }

      throw new Error(errorData.error || "Failed to delete zone");
    }

    window.location.reload();
  } catch (error) {
    console.error("Error deleting zone:", error);
    alert(
      error instanceof Error
        ? error.message
        : "Er is een fout opgetreden bij het verwijderen van de zone."
    );
  }
};

const handleAddZone = async (
  formData: Zone,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: Zone) => void
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
        breedte: formData.breedte,
        lengte: formData.lengte,
        naam: formData.naam,
        evenement_id: formData.EvenementId, // Aangepast naar evenement_id zoals verwacht door de API
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to add zone (${response.status})`
      );
    }

    setIsOpen(false);
    setFormData({
      breedte: 0,
      lengte: 0,
      naam: "",
      EvenementId: 0,
    } as Zone);

    alert("Zone succesvol toegevoegd!");
    window.location.reload();
  } catch (error) {
    console.error("Error adding zone:", error);
    setError(error instanceof Error ? error.message : "Failed to add zone");
  } finally {
    setIsLoading(false);
  }
};

const handleUpdateZone = async (
  formData: Zone,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: Zone) => void
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
        naam: formData.naam,
        breedte: formData.breedte,
        lengte: formData.lengte,
        evenement_id: formData.EvenementId, // Added this line to include the event ID
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to update zone (${response.status})`
      );
    }

    setIsOpen(false);
    setFormData({
      naam: "",
      breedte: 0,
      lengte: 0,
      EvenementId: 0,
    } as Zone);

    alert("Zone successfully updated!");
    window.location.reload();
  } catch (error) {
    console.error("Error updating zone:", error);
    setError(error instanceof Error ? error.message : "Failed to update zone");
  } finally {
    setIsLoading(false);
  }
};

const fetchEvents = async (): Promise<Event[]> => {
  console.log(`Fetching events from: ${eventsApiUrl}`);
  try {
    const res = await fetch(eventsApiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    console.log(`Fetch response status from ${eventsApiUrl}: ${res.status}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `Error fetching ${eventsApiUrl}: ${res.status} ${res.statusText}`
      );
      console.error(`Response body: ${errorText.substring(0, 500)}...`);
      throw new Error(
        `Failed to fetch events. Status: ${res.status}. Check server logs.`
      );
    }

    const data = await res.json();
    return data as Event[];
  } catch (error) {
    console.error(`Error in fetchEvents:`, error);
    throw error;
  }
};

export default {
  getZones,
  handleDelete,
  handleAddZone,
  handleUpdateZone,
  fetchEvents,
};
