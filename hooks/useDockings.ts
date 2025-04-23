import { Docking } from "@/app/types";

const apiUrl = "https://drone.ziasvannes.tech/api/dockings";

// Function to fetch dockings from your API
async function getDockings(): Promise<Docking[]> {
  console.log(`Fetching dockings from: ${apiUrl}`);
  try {
    const res = await fetch(apiUrl, { cache: "no-store" });
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
    return data as Docking[];
  } catch (error) {
    console.error(`Error in getDockings:`, error);
    throw error;
  }
}

const handleDelete = async (id: number) => {
  if (!confirm(`Are you sure you want to delete docking ${id}?`)) return;
  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Docking deleted successfully");
      window.location.reload();
    } else {
      const errorData = await res.json();
      alert(`Failed to delete docking: ${errorData.error || res.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting docking:", error);
    alert("An error occurred while deleting the docking.");
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

  // Basic validation
  if (!formData.naam || !formData.locatie) {
    setError("Name and location are required.");
    setIsLoading(false);
    return;
  }

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }

    setIsOpen(false);
    setFormData({ naam: "", locatie: "", id: 0 });
    alert("Docking added successfully!");
    window.location.reload();
  } catch (err: any) {
    setError(err.message || "An unknown error occurred.");
    console.error("Error adding docking:", err);
  } finally {
    setIsLoading(false);
  }
};

// Helper to get status badge variant (if applicable)
const getStatusBadgeVariant = (status: string): string => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-800";
    case "IN_USE":
      return "bg-blue-100 text-blue-800";
    case "MAINTENANCE":
      return "bg-yellow-100 text-yellow-800";
    case "OFFLINE":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default { getDockings, handleDelete, handleAddDocking, getStatusBadgeVariant };