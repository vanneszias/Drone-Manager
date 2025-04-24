import { Event } from "@/app/types";

const apiUrl = "https://drone.ziasvannes.tech/api/events";

async function getEvents(): Promise<Event[]> {
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
        `Failed to fetch events. Status: ${res.status}. Check server logs.`
      );
    }

    const data = await res.json();
    return data as Event[];
  } catch (error) {
    console.error(`Error in getEvents:`, error);
    throw error;
  }
}

const handleDelete = async (id: number) => {
  if (!confirm(`Weet je zeker dat je event ${id} wilt verwijderen?`)) return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete event");
    }

    window.location.reload();
  } catch (error) {
    console.error("Error deleting event:", error);
    alert("Er is een fout opgetreden bij het verwijderen van het event.");
  }
};

const handleAddEvent = async (
  formData: Event,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: Event) => void
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
        naam: formData.Naam,
        start_datum: formData.StartDatum,
        eind_datum: formData.EindDatum,
        start_tijd: formData.StartTijd,
        tijdsduur: formData.Tijdsduur,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to add event (${response.status})`
      );
    }

    setIsOpen(false);
    setFormData({
      Naam: "",
      StartDatum: "",
      EindDatum: "",
      StartTijd: "",
      Tijdsduur: "",
    } as Event);

    alert("Event succesvol toegevoegd!");
    window.location.reload();
  } catch (error) {
    console.error("Error adding event:", error);
    setError(error instanceof Error ? error.message : "Failed to add event");
  } finally {
    setIsLoading(false);
  }
};

const handleUpdateEvent = async (
  formData: Event,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: Event) => void
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
        naam: formData.Naam,
        start_datum: formData.StartDatum,
        eind_datum: formData.EindDatum,
        start_tijd: formData.StartTijd,
        tijdsduur: formData.Tijdsduur,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.error || `Failed to update event (${response.status})`;
      console.error("Update event error details:", errorData);
      throw new Error(errorMessage);
    }

    setIsOpen(false);
    setFormData({
      Naam: "",
      StartDatum: "",
      EindDatum: "",
      StartTijd: "",
      Tijdsduur: "",
    } as Event);

    alert("Event succesvol bijgewerkt!");
    window.location.reload();
  } catch (error) {
    console.error("Error updating event:", error);
    setError(error instanceof Error ? error.message : "Failed to update event");
  } finally {
    setIsLoading(false);
  }
};

export default {
  getEvents,
  handleDelete,
  handleAddEvent,
  handleUpdateEvent,
};
