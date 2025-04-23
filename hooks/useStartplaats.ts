import { Startplaats } from '@/app/types';

const apiUrl = 'https://drone.ziasvannes.tech/api/startplaatsen';

async function getStartplaats(): Promise<Startplaats[]> {
  try {
    const res = await fetch(apiUrl, { cache: 'no-store', headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`Failed to fetch startplaats: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching startplaats:', error);
    throw error;
  }
}

const handleDelete = async (id: number) => {
  if (!confirm(`Are you sure you want to delete startplaats ${id}?`)) return;
  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete startplaats: ${res.statusText}`);
    alert('Startplaats deleted successfully');
    window.location.reload();
  } catch (error) {
    console.error('Error deleting startplaats:', error);
    alert('An error occurred while deleting the startplaats.');
  }
};

const handleAddStartplaats = async (formData: Startplaats, setIsLoading: (isLoading: boolean) => void, setError: (error: string | null) => void, setIsOpen: (isOpen: boolean) => void, setFormData: (formData: Startplaats) => void) => {
  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error(`Failed to add startplaats: ${response.statusText}`);
    setIsOpen(false);
    setFormData({ id: 0, naam: '', locatie: '', isBeschikbaar: false });
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