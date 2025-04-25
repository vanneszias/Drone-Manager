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
    // Validate required fields
    if (!formData.Naam?.trim()) {
      throw new Error("Event name is required");
    }

    if (
      !formData.StartDatum ||
      !formData.EindDatum ||
      !formData.StartTijd ||
      !formData.Tijdsduur
    ) {
      throw new Error("All date and time fields are required");
    }

    // Additional validation
    const startDate = new Date(formData.StartDatum);
    const endDate = new Date(formData.EindDatum);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format");
    }

    if (endDate < startDate) {
      throw new Error("End date cannot be before start date");
    }

    // Ensure time strings are in HH:mm:ss format
    const formatTimeString = (time: string): string => {
      if (!time) return "";
      return time.length === 5 ? `${time}:00` : time;
    };

    const eventData = {
      Naam: formData.Naam.trim(),
      StartDatum: formData.StartDatum,
      EindDatum: formData.EindDatum,
      StartTijd: formatTimeString(formData.StartTijd),
      Tijdsduur: formatTimeString(formData.Tijdsduur),
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.message || `Failed to add event (${response.status})`
      );
    }

    setIsOpen(false);
    setFormData({
      Id: 0,
      Naam: "",
      StartDatum: "",
      EindDatum: "",
      StartTijd: "",
      Tijdsduur: "",
    });

    // Use a more user-friendly success notification method if available
    alert("Event successfully added!");
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
    // Validate required fields
    if (!formData.Naam?.trim()) {
      throw new Error("Event name is required");
    }

    if (
      !formData.StartDatum ||
      !formData.EindDatum ||
      !formData.StartTijd ||
      !formData.Tijdsduur
    ) {
      throw new Error("All date and time fields are required");
    }

    // Additional validation
    const startDate = new Date(formData.StartDatum);
    const endDate = new Date(formData.EindDatum);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid date format");
    }

    if (endDate < startDate) {
      throw new Error("End date cannot be before start date");
    }

    // Ensure time strings are in HH:mm:ss format
    const formatTimeString = (time: string): string => {
      if (!time) return "";
      return time.length === 5 ? `${time}:00` : time;
    };

    const eventData = {
      Naam: formData.Naam.trim(),
      StartDatum: formData.StartDatum,
      EindDatum: formData.EindDatum,
      StartTijd: formatTimeString(formData.StartTijd),
      Tijdsduur: formatTimeString(formData.Tijdsduur),
    };

    const response = await fetch(`${apiUrl}/${formData.Id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          data.message ||
          `Failed to update event (${response.status})`
      );
    }

    setIsOpen(false);
    setFormData({
      Id: 0,
      Naam: "",
      StartDatum: "",
      EindDatum: "",
      StartTijd: "",
      Tijdsduur: "",
    });

    alert("Event successfully updated!");
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
