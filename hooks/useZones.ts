import { Zone } from '@/app/types';

const apiUrl = 'https://drone.ziasvannes.tech/api/zones';

// Define the input type expected by the API (matching backend)
interface ZoneApiInput {
  naam: string;
  breedte: number;
  lengte: number;
  evenement_id: number;
}

// Define the type for the reset function
type ResetZoneForm = () => void;


function getTypeBadgeVariant(type: Zone['type']) {
  const variants = {
    'RESTRICTED': 'bg-amber-100 text-amber-800 hover:bg-amber-200/80',
    'NO_FLY': 'bg-red-100 text-red-800 hover:bg-red-200/80',
    'LANDING': 'bg-blue-100 text-blue-800 hover:bg-blue-200/80',
    'OPERATIONAL': 'bg-green-100 text-green-800 hover:bg-green-200/80',
  };
  return variants[type] || 'bg-gray-100 text-gray-800 hover:bg-gray-200/80';
}

function getStatusBadgeVariant(status: Zone['status']) {
  const variants = {
    'ACTIVE': 'bg-green-100 text-green-800 hover:bg-green-200/80',
    'INACTIVE': 'bg-gray-100 text-gray-800 hover:bg-gray-200/80',
    'MAINTENANCE': 'bg-amber-100 text-amber-800 hover:bg-amber-200/80',
  };
  return variants[status] || 'bg-gray-100 text-gray-800 hover:bg-gray-200/80';
}

// Actions
async function handleAddZone(
  zoneData: ZoneApiInput, // Expect the correct structure
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (open: boolean) => void,
  resetForm: ResetZoneForm // Use the specific reset function type
) {
  try {
    setIsLoading(true);
    setError(null);
    console.log("Sending Zone Data to API:", zoneData); // Log data being sent

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zoneData), // Send the correct data
    });

    if (!response.ok) {
      let errorMsg = 'Failed to add zone';
      try {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        errorMsg = errorData.error || `HTTP error! status: ${response.status}`;
      } catch (jsonError) {
        // If response is not JSON
        errorMsg = `HTTP error! status: ${response.status}`;
        console.error("Non-JSON API Error Response:", await response.text());
      }
      throw new Error(errorMsg);
    }

    // Success
    resetForm(); // Call the reset function passed from the dialog
    setIsOpen(false);
    alert('Zone added successfully!');

    // Optionally refresh the data
    window.location.reload(); // Simple refresh
  } catch (error: any) {
    console.error("Error adding zone:", error);
    setError(error.message || "An unknown error occurred while adding the zone.");
  } finally {
    setIsLoading(false);
  }
}

async function handleDelete(id: string) {
  if (confirm('Are you sure you want to delete this zone?')) {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete zone');
      }

      // Refresh the page to show updated list
      window.location.reload();
    } catch (error) {
      console.error("Error deleting zone:", error);
    }
  }
}

async function getZones(): Promise<Zone[]> {
  // Make sure this fetches from the correct URL (absolute or relative based on deployment)
  console.log(`Fetching zones from: ${apiUrl}`);
  try {
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch zones: ${response.status} - ${errorText.substring(0, 100)}`);
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await response.text();
      throw new Error(`API route ${apiUrl} did not return JSON. Received: ${contentType}. Body: ${responseText.substring(0, 100)}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching zones:', error);
    throw error; // Re-throw to be caught by page component
  }
}

// Functie voor het ophalen van één specifieke zone
async function getZoneById(id: string): Promise<Zone> {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch zone: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching zone with ID ${id}:`, error);
    throw error;
  }
}

export default {
  getZones,
  getZoneById,
  handleAddZone,
  handleDelete,
  getTypeBadgeVariant,
  getStatusBadgeVariant,
};