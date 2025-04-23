import { Drone } from '@/app/types';

const apiUrl = 'https://drone.ziasvannes.tech/api/drones';

// Type for data sent to API (snake_case keys)
interface DroneApiInput {
  status: Drone['status'];
  batterij: number;
  mag_opstijgen: boolean; // Use snake_case for API
}

// Type for the reset function argument
type ResetDroneForm = (formData: Partial<Drone>) => void;

// Function to fetch drones from your API
async function getDrones(): Promise<Drone[]> {
  console.log(`Server-side fetch initiated for: ${apiUrl}`); // Add logging

  try {
    const res = await fetch(apiUrl, {
      cache: 'no-store', // Disable caching for dynamic data
      headers: {
        'Accept': 'application/json',
      }
    });

    console.log(`Fetch response status from ${apiUrl}: ${res.status}`); // Log status

    if (!res.ok) {
      const errorText = await res.text(); // Get error body
      console.error(`Error fetching ${apiUrl}: ${res.status} ${res.statusText}`);
      console.error(`Response body: ${errorText.substring(0, 500)}...`); // Log response body
      // Throw an error to be caught by Next.js error handling (error.tsx)
      throw new Error(`Failed to fetch drones. Status: ${res.status}. Check server logs.`);
    }

    // Verify Content-Type before parsing
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await res.text(); // Get body if not JSON
      console.error(`Expected JSON but received ${contentType} from ${apiUrl}`);
      console.error(`Response body: ${responseText.substring(0, 500)}...`);
      throw new Error(`API route ${apiUrl} did not return JSON. Received: ${contentType}`);
    }

    const data = await res.json();
    console.log(`Successfully fetched and parsed data from ${apiUrl}`);
    // Map API response (PascalCase magOpstijgen) to frontend type (camelCase)
    return data.map((item: any) => ({
      id: item.Id,
      status: item.status,
      batterij: item.batterij,
      magOpstijgen: item.magOpstijgen // Ensure this matches the frontend type
    })) as Drone[];


  } catch (error) {
    console.error(`Error in getDrones fetching ${apiUrl}:`, error);
    // Re-throw the error so Next.js can handle it (e.g., show error.tsx)
    throw error;
  }
}

const handleDelete = async (id: number) => {
  if (!confirm(`Are you sure you want to delete drone ${id}?`)) return;
  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('Drone deleted successfully');
      // TODO: Refresh data - Need a better way, e.g., router.refresh() or state management
      window.location.reload(); // Simple but not ideal
    } else {
      let errorMsg = `Failed to delete drone (${res.status})`;
      try {
        const errorData = await res.json();
        errorMsg = errorData.error || errorMsg;
      } catch (e) { /* Ignore if response not JSON */ }
      alert(errorMsg);
    }
  } catch (error) {
    console.error("Error deleting drone:", error);
    alert("An error occurred while deleting the drone.");
  }
};

const handleAddDrone = async (
  apiData: DroneApiInput, // Expect snake_case data
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: ResetDroneForm // Use the specific reset function type
) => {
  setIsLoading(true);
  setError(null);

  // Basic validation
  if (apiData.batterij === undefined || apiData.batterij < 0 || apiData.batterij > 100) {
    setError("Battery must be between 0 and 100.");
    setIsLoading(false);
    return;
  }
  if (!apiData.status) {
    setError("Status is required.");
    setIsLoading(false);
    return;
  }


  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiData),
    });

    if (!response.ok) {
      let errorMsg = `Failed to add drone (${response.status})`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch (e) { /* Ignore if response not JSON */ }
      throw new Error(errorMsg);
    }

    // Success
    setIsOpen(false); // Close dialog
    setFormData({ status: 'OFFLINE', magOpstijgen: false, batterij: 0 }); // Reset form state
    alert('Drone added successfully!');
    // TODO: Ideally refresh data without full page reload
    window.location.reload(); // Simple refresh
  } catch (err: any) {
    setError(err.message || "An unknown error occurred.");
    console.error("Error adding drone:", err);
  } finally {
    setIsLoading(false);
  }
};

// Helper to get badge color based on status
const getStatusBadgeVariant = (status: Drone['status']): string => {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-green-100 text-green-800';
    case 'IN_USE':
      return 'bg-blue-100 text-blue-800';
    case 'MAINTENANCE':
      return 'bg-yellow-100 text-yellow-800';
    case 'OFFLINE':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper to get battery color
const getBatteryColor = (level: number): string => {
  if (level > 70) return 'text-green-600';
  if (level > 30) return 'text-yellow-600';
  return 'text-red-600';
}

export default { getDrones, handleDelete, getStatusBadgeVariant, getBatteryColor, handleAddDrone };