import { VluchtCyclus } from '@/app/types';

const apiUrl = 'https://drone.ziasvannes.tech/api/vluchtcyclus';

async function getVluchtCyclussen(): Promise<VluchtCyclus[]> {
  console.log(`Server-side fetch initiated for: ${apiUrl}`);

  try {
    const res = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Error fetching ${apiUrl}: ${res.status} ${res.statusText}`);
      console.error(`Response body: ${errorText.substring(0, 500)}...`);
      throw new Error(`Failed to fetch vluchtcyclussen. Status: ${res.status}`);
    }

    const data = await res.json();
    return data as VluchtCyclus[];

  } catch (error) {
    console.error(`Error in getVluchtCyclussen:`, error);
    throw error;
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('Weet je zeker dat je deze vluchtcyclus wilt verwijderen?')) {
    return;
  }

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!res.ok) {
      throw new Error('Failed to delete vluchtcyclus');
    }

    window.location.reload();
  } catch (error) {
    console.error("Error deleting vluchtcyclus:", error);
    alert("Er is een fout opgetreden bij het verwijderen van de vluchtcyclus");
  }
};

const handleAddVluchtCyclus = async (
  formData: VluchtCyclus,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: VluchtCyclus) => void
) => {
  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        VerslagId: formData.VerslagId,
        PlaatsId: formData.PlaatsId,
        DroneId: formData.DroneId,
        ZoneId: formData.ZoneId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to add vluchtcyclus (${response.status})`);
    }

    setIsOpen(false);
    setFormData({
      Id: 0,
      VerslagId: 0,
      PlaatsId: 0,
      DroneId: 0,
      ZoneId: 0
    });

    alert('Vluchtcyclus succesvol toegevoegd!');
    window.location.reload();
  } catch (error) {
    console.error('Error adding vluchtcyclus:', error);
    setError(error instanceof Error ? error.message : 'Failed to add vluchtcyclus');
  } finally {
    setIsLoading(false);
  }
};

export default {
  getVluchtCyclussen,
  handleDelete,
  handleAddVluchtCyclus
};