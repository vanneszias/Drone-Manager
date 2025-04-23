import { Verslag } from '@/app/types';

const apiUrl = 'https://drone.ziasvannes.tech/api/verslagen';

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
  formData: Verslag,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: Verslag) => void
) => {
  setIsLoading(true);
  setError(null);

  // Basic validation
  if (!formData.onderwerp) {
    setError("Onderwerp is required.");
    setIsLoading(false);
    return;
  }

  // Prepare data for API
  const apiData = {
    onderwerp: formData.onderwerp,
    beschrijving: formData.beschrijving,
    isverzonden: formData.isverzonden,
    droneId: formData.droneId
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(apiData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to add verslag (${response.status})`);
    }

    setIsOpen(false);
    setFormData({
      id: 0,
      onderwerp: '',
      beschrijving: '',
      isverzonden: false,
      droneId: 0
    });

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