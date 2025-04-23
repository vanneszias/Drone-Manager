import { VluchtCyclus } from '@/app/types';

const apiUrl = 'https://drone.ziasvannes.tech/api/vlucht-cycli';

interface VluchtCyclusInput {
    VerslagId: number;
    PlaatsId: number;
    DroneId: number;
    ZoneId: number;
}

async function getVluchtCycli(): Promise<VluchtCyclus[]> {
    console.log(`Server-side fetch initiated for: ${apiUrl}`);

    try {
        const res = await fetch(apiUrl, {
            cache: 'no-store', // Disable caching for dynamic data
            headers: {
                'Accept': 'application/json',
            }
        });

        console.log(`Fetch response status from ${apiUrl}: ${res.status}`);

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Error fetching ${apiUrl}: ${res.status} ${res.statusText}`);
            console.error(`Response body: ${errorText.substring(0, 500)}...`);
            // Throw an error to be caught by Next.js error handling (error.tsx)
            throw new Error(`Failed to fetch ${apiUrl}`);
        }

        const data: VluchtCyclus[] = await res.json();
        console.log(`Fetched ${data.length} vlucht cycli from ${apiUrl}`);
        return data;
    } catch (error) {
        console.error(`Error in getVluchtCycli fetching ${apiUrl}:`, error);
        // Re-throw the error so Next.js can handle it (e.g., show error.tsx)
        throw error;
    }
}

const handleDelete = async (id: number) => {
    if (!confirm(`Are you sure you want to delete vlucht cyclus ${id}?`)) return;
    try {
        const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert('Vlucht cyclus deleted successfully');
            // TODO: Refresh data - Need a better way, e.g., router.refresh() or state management
            window.location.reload(); // Simple but not ideal
        } else {
            const errorData = await res.json();
            alert(`Failed to delete vlucht cyclus: ${errorData.error || res.statusText}`);
        }
    } catch (error) {
        console.error("Error deleting vlucht cyclus:", error);
        alert("An error occurred while deleting the vlucht cyclus.");
    }
};

const handleAddVluchtCyclus = async (
    formData: VluchtCyclusInput,
    setIsLoading: (isLoading: boolean) => void,
    setError: (error: string | null) => void,
    setIsOpen: (isOpen: boolean) => void,
    setFormData: (formData: VluchtCyclusInput) => void
) => {
    setIsLoading(true);
    setError(null);
    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            setError(errorData.error || res.statusText);
            setIsLoading(false);
            return;
        }

        alert('Vlucht cyclus added successfully');
        setIsOpen(false);
        setFormData({
            VerslagId: 0,
            PlaatsId: 0,
            DroneId: 0,
            ZoneId: 0
        });
    } catch (error) {
        console.error("Error adding vlucht cyclus:", error);
        alert("An error occurred while adding the vlucht cyclus.");
    }
}

export { handleDelete, handleAddVluchtCyclus, getVluchtCycli };
