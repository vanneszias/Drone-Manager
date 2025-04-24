import { Docking } from "@/app/types";

const apiUrl = "https://drone.ziasvannes.tech/api/docking"; // Corrected API Endpoint base

// Type for data sent to API
interface DockingInput {
  locatie: string;
  isbeschikbaar: boolean;
}

// Type for the reset function argument (partial is fine here)
type ResetDockingForm = (formData: Partial<DockingInput>) => void;

// Function to fetch dockings from your API
async function getDockings(): Promise<Docking[]> {
  console.log(`Fetching dockings from: ${apiUrl}`);
  try {
    const res = await fetch(apiUrl, { cache: "no-store" }); // Fetch from base URL
    console.log(`Fetch response status: ${res.status}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Error fetching dockings: ${res.status} ${res.statusText}`);
      console.error(`Response body: ${errorText.substring(0, 500)}...`);

      if (res.status === 404) {
        throw new Error("Dockings endpoint not found. Please check the API URL or server configuration.");
      }

      throw new Error(`Failed to fetch dockings. Status: ${res.status}`);
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await res.text();
      console.error(`Expected JSON but received ${contentType}`);
      console.error(`Response body: ${responseText.substring(0, 500)}...`);
      throw new Error(`API did not return JSON. Received: ${contentType}`);
    }

    const data = await res.json();
    console.log(`Successfully fetched dockings`);
    // Map API response (snake_case) to frontend type (camelCase if different, but here they match except casing)
    return data.map((item: any) => ({
      id: item.Id,
      locatie: item.locatie,
      isbeschikbaar: item.isbeschikbaar
    })) as Docking[];
  } catch (error) {
    console.error(`Error in getDockings:`, error);
    throw error;
  }
}

const handleDelete = async (id: number) => {
  if (!confirm(`Are you sure you want to delete docking ${id}?`)) return;
  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" }); // Use correct endpoint with ID
    if (res.ok) {
      alert("Docking deleted successfully");
      window.location.reload();
    } else {
      let errorMsg = `Failed to delete docking (${res.status})`;
      try {
        const errorData = await res.json();
        errorMsg = errorData.error || errorMsg;
      } catch (e) { /* Ignore if response not JSON */ }
      alert(errorMsg);
    }
  } catch (error) {
    console.error("Error deleting docking:", error);
    alert("An error occurred while deleting the docking.");
  }
};

const handleAddDocking = async (
  formData: DockingInput, // Expect the correct input type
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: ResetDockingForm // Use the specific reset function type
) => {
  setIsLoading(true);
  setError(null);

  // Basic validation
  if (!formData.locatie) {
    setError("Location is required.");
    setIsLoading(false);
    return;
  }

  try {
    const res = await fetch(apiUrl, { // Post to base URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData), // Send snake_case data
    });

    if (!res.ok) {
      let errorMsg = `Failed to add docking (${res.status})`;
      try {
        const errorData = await res.json();
        errorMsg = errorData.error || errorMsg;
      } catch (e) { /* Ignore if response not JSON */ }
      throw new Error(errorMsg);
    }

    setIsOpen(false);
    setFormData({ locatie: "", isbeschikbaar: true }); // Reset form to initial state
    alert("Docking added successfully!");
    window.location.reload();
  } catch (err: any) {
    setError(err.message || "An unknown error occurred.");
    console.error("Error adding docking:", err);
  } finally {
    setIsLoading(false);
  }
};


export default { getDockings, handleDelete, handleAddDocking };