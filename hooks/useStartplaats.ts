import { Startplaats } from '@/app/types';

const apiUrl = 'https://drone.ziasvannes.tech/api/startplaatsen';

// Type for data sent/received by API/form
interface StartplaatsInput {
  locatie: string;
  isbeschikbaar: boolean;
}

// Type for the reset function argument
type ResetStartplaatsForm = (formData: StartplaatsInput) => void;

async function getStartplaats(): Promise<Startplaats[]> {
  try {
    const res = await fetch(apiUrl, { cache: 'no-store', headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`Failed to fetch startplaats: ${res.statusText}`);

    const data = await res.json();
    // Map API response (snake_case) to frontend type (camelCase if different, but here they match except casing)
    return data.map((item: any) => ({
      id: item.Id,
      locatie: item.locatie,
      isbeschikbaar: item.isbeschikbaar
    })) as Startplaats[];

  } catch (error) {
    console.error('Error fetching startplaats:', error);
    throw error;
  }
}

const handleDelete = async (id: number) => {
  if (!confirm(`Are you sure you want to delete startplaats ${id}?`)) return;
  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      let errorMsg = `Failed to delete startplaats (${res.status})`;
      try {
        const errorData = await res.json();
        errorMsg = errorData.error || errorMsg;
      } catch (e) { /* Ignore if response not JSON */ }
      throw new Error(errorMsg);
    }
    alert('Startplaats deleted successfully');
    window.location.reload();
  } catch (error) {
    console.error('Error deleting startplaats:', error);
    alert('An error occurred while deleting the startplaats.');
  }
};

const handleAddStartplaats = async (
  formData: StartplaatsInput, // Expect only relevant fields
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: ResetStartplaatsForm // Use the specific reset function type
) => {
  setIsLoading(true);
  setError(null);

  // Validation
  if (!formData.locatie) { setError("Locatie is required."); setIsLoading(false); return; }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData), // Send snake_case data
    });

    if (!response.ok) {
      let errorMsg = `Failed to add startplaats (${response.status})`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch (e) { /* Ignore if response not JSON */ }
      throw new Error(errorMsg);
    }

    setIsOpen(false);
    setFormData({ locatie: '', isbeschikbaar: true }); // Reset form state
    alert('Startplaats added successfully!');
    window.location.reload();
  } catch (error: any) {
    setError(error.message || "An unknown error occurred.");
    console.error("Error adding startplaats:", error);
  } finally {
    setIsLoading(false);
  }
};

export default { getStartplaats, handleDelete, handleAddStartplaats };