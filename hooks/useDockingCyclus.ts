import { DockingCyclus } from '@/app/types';

const apiUrl = 'https://drone.ziasvannes.tech/api/docking-cycli';

async function getDockingCycli(): Promise<DockingCyclus[]> {
  console.log(`Server-side fetch initiated for: ${apiUrl}`);

  try {
    const res = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch docking cycli. Status: ${res.status}`);
    }

    const data = await res.json();
    return data as DockingCyclus[];

  } catch (error) {
    console.error(`Error in getDockingCycli:`, error);
    throw error;
  }
}

const handleDelete = async (Id: number) => {
  if (!confirm(`Weet je zeker dat je deze docking cyclus wilt verwijderen?`)) return;
  
  try {
    const res = await fetch(`${apiUrl}/${Id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!res.ok) {
      throw new Error('Failed to delete docking cyclus');
    }

    window.location.reload();
  } catch (error) {
    console.error("Error deleting docking cyclus:", error);
    alert("Er is een fout opgetreden bij het verwijderen.");
  }
};

const handleAddDockingCyclus = async (
  formData: DockingCyclus,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: DockingCyclus) => void
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
        DroneId: formData.DroneId,
        DockingId: formData.DockingId,
        CyclusId: formData.CyclusId
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to add docking cyclus (${response.status})`);
    }

    setIsOpen(false);
    setFormData({
      Id: 0,
      DockingId: 0,
      CyclusId: 0,
      DroneId: 0
    } as DockingCyclus);

    alert('Docking Cyclus succesvol toegevoegd!');
    window.location.reload();
  } catch (error) {
    console.error('Error adding docking cyclus:', error);
    setError(error instanceof Error ? error.message : 'Failed to add docking cyclus');
  } finally {
    setIsLoading(false);
  }
};

export default {
  getDockingCycli,
  handleDelete,
  handleAddDockingCyclus
};