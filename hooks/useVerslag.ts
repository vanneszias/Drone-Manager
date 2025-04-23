import { Verslag } from '@/app/types';

const apiUrl = 'https://drone.ziasvannes.tech/api/verslagen';

interface VerslagInput {
  onderwerp: string;
  inhoud: string;
  isverzonden?: boolean;
  isgeaccepteerd?: boolean;
  vlucht_cyclus_id?: number | null | string;
}

// Function to fetch verslagen from API
async function getVerslagen(): Promise<Verslag[]> {
  console.log(`Server-side fetch initiated for: ${apiUrl}`);

  try {
    const res = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Error fetching ${apiUrl}: ${res.status} ${res.statusText}`);
      console.error(`Response body: ${errorText.substring(0, 500)}...`);
      throw new Error(`Failed to fetch verslagen. Status: ${res.status}. Check server logs.`);
    }

    // Verify Content-Type before parsing
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await res.text();
      console.error(`Expected JSON but received ${contentType} from ${apiUrl}`);
      console.error(`Response body: ${responseText.substring(0, 500)}...`);
      throw new Error(`API route ${apiUrl} did not return JSON. Received: ${contentType}`);
    }

    const data = await res.json();
    console.log(`Successfully fetched and parsed data from ${apiUrl}`);
    return data as Verslag[];

  } catch (error) {
    console.error(`Error in getVerslagen fetching ${apiUrl}:`, error);
    throw error;
  }
}

const handleDelete = async (id: number) => {
  if (!confirm(`Are you sure you want to delete verslag ${id}?`)) return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Failed to delete verslag (${res.status})`);
    }

    alert('Verslag deleted successfully');
    window.location.reload();
  } catch (error) {
    console.error("Error deleting verslag:", error);
    alert("An error occurred while deleting the verslag.");
  }
};

const handleAddVerslag = async (
  formData: VerslagInput, // Use the updated input type
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  resetForm: () => void
) => {
  setIsLoading(true);
  setError(null);

  if (!formData.onderwerp || !formData.inhoud) {
    setError("Onderwerp (Subject) and Inhoud (Content) are required.");
    setIsLoading(false);
    return;
  }

  // Prepare data for API - ensure snake_case keys match API endpoint expectation
  const apiData: { [key: string]: any } = { // Use index signature for dynamic keys
    onderwerp: formData.onderwerp,
    inhoud: formData.inhoud,
    isverzonden: formData.isverzonden ?? false,
    isgeaccepteerd: formData.isgeaccepteerd ?? false,
  };

  // Only include vlucht_cyclus_id if it's provided and not null/undefined
  if (formData.vlucht_cyclus_id !== undefined && formData.vlucht_cyclus_id !== null) {
    // Ensure it's a valid number before sending
    const idNum = Number(formData.vlucht_cyclus_id);
    if (!isNaN(idNum) && idNum > 0) {
      apiData.vlucht_cyclus_id = idNum; // Add snake_case key
    } else if (formData.vlucht_cyclus_id !== null) { // Don't send if it's just an empty string from input
      setError("Invalid Flight Cycle ID provided. Must be a positive number.");
      setIsLoading(false);
      return;
    }
  }

  console.log("Sending Verslag data to API:", apiData);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(apiData) // Send corrected data
    });

    if (!response.ok) {
      let errorMsg = `Failed to add verslag (${response.status})`;
      try {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        errorMsg = errorData.error || errorMsg;
      } catch (e) {
        console.error("Non-JSON API Error Response:", await response.text());
      }
      throw new Error(errorMsg);
    }

    // Success
    setIsOpen(false);
    resetForm();
    alert('Verslag added successfully!');
    window.location.reload();

  } catch (error) {
    console.error('Error adding verslag:', error);
    setError(error instanceof Error ? error.message : 'Failed to add verslag');
  } finally {
    setIsLoading(false);
  }
};

// Helper functions if needed (similar to drone status/battery indicators)
const getVerslagStatusColor = (isverzonden: boolean): string => {
  return isverzonden ? 'text-green-600' : 'text-yellow-600';
};

export default {
  getVerslagen,
  handleDelete,
  handleAddVerslag,
  getVerslagStatusColor
};