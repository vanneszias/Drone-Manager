import { Drone } from '@/app/types';

const apiUrl = 'https://drone.ziasvannes.tech/api/drones';

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
    return data as Drone[];

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
      const errorData = await res.json();
      alert(`Failed to delete drone: ${errorData.error || res.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting drone:", error);
    alert("An error occurred while deleting the drone.");
  }
};

const handleAddDrone = async (formData: Drone, setIsLoading: (isLoading: boolean) => void, setError: (error: string | null) => void, setIsOpen: (isOpen: boolean) => void, setFormData: (formData: Drone) => void) => {
  setIsLoading(true);
  setError(null);

  // Basic validation
  if (formData.batterij === undefined || formData.batterij < 0 || formData.batterij > 100) {
    setError("Battery must be between 0 and 100.");
    setIsLoading(false);
    return;
  }
  if (!formData.status) {
    setError("Status is required.");
    setIsLoading(false);
    return;
  }

  // Prepare data for API (match expected fields in api/app.py create_drone)
  const apiData = {
    status: formData.status,
    batterij: formData.batterij, // API expects 'batterij'
    magOpstijgen: formData.magOpstijgen, // API expects 'magOpstijgen'
  };


  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    // Success
    setIsOpen(false); // Close dialog
    setFormData({ status: 'OFFLINE', magOpstijgen: false, batterij: 0, id: 0 }); // Reset form
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