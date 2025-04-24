import { VluchtCyclus } from '@/app/types';

const apiUrl = 'https://drone.ziasvannes.tech/api/vlucht-cycli';

// Type for data sent to API (snake_case keys)
interface VluchtCyclusApiInput {
    verslag_id?: number | null; // Use snake_case and allow null
    plaats_id?: number | null;
    drone_id?: number | null;
    zone_id?: number | null;
}

// Type for the reset function
type ResetVluchtCyclusForm = () => void;

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

        // Verify Content-Type before parsing
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const responseText = await res.text();
            console.error(`Expected JSON but received ${contentType} from ${apiUrl}`);
            console.error(`Response body: ${responseText.substring(0, 500)}...`);
            throw new Error(`API route ${apiUrl} did not return JSON. Received: ${contentType}`);
        }


        const data = await res.json();
        console.log(`Fetched ${data.length} vlucht cycli from ${apiUrl}`);
        // Map API response (PascalCase IDs) to frontend type (PascalCase)
        return data.map((item: any) => ({
            Id: item.Id,
            VerslagId: item.VerslagId,
            PlaatsId: item.PlaatsId,
            DroneId: item.DroneId,
            ZoneId: item.ZoneId
        })) as VluchtCyclus[];

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
            let errorMsg = `Failed to delete vlucht cyclus (${res.status})`;
            try {
                const errorData = await res.json();
                errorMsg = errorData.error || errorMsg;
            } catch (e) { /* Ignore if response not JSON */ }
            alert(errorMsg);
        }
    } catch (error) {
        console.error("Error deleting vlucht cyclus:", error);
        alert("An error occurred while deleting the vlucht cyclus.");
    }
};

const handleAddVluchtCyclus = async (
    apiData: VluchtCyclusApiInput, // Expect snake_case data
    setIsLoading: (isLoading: boolean) => void,
    setError: (error: string | null) => void,
    setIsOpen: (isOpen: boolean) => void,
    resetForm: ResetVluchtCyclusForm // Use the specific reset function type
) => {
    setIsLoading(true);
    setError(null);

    // Remove keys with null or undefined values if API expects only provided keys
    const filteredApiData = Object.entries(apiData).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') { // Exclude empty strings too
            acc[key as keyof VluchtCyclusApiInput] = value;
        }
        return acc;
    }, {} as Partial<VluchtCyclusApiInput>);

    // Ensure at least one ID is present after filtering
    if (Object.keys(filteredApiData).length === 0) {
        setError("Please provide at least one valid ID (Verslag, Plaats, Drone, or Zone).");
        setIsLoading(false);
        return;
    }

    console.log("Sending VluchtCyclus Data:", filteredApiData);

    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filteredApiData), // Send filtered data
        });

        if (!res.ok) {
            let errorMsg = `Failed to add vlucht cyclus (${res.status})`;
            try {
                const errorData = await res.json();
                errorMsg = errorData.error || errorMsg;
            } catch (e) { /* Ignore if response not JSON */ }
            throw new Error(errorMsg);
        }

        setIsOpen(false);
        resetForm(); // Call the reset function
        alert('Vlucht cyclus added successfully');
        window.location.reload(); // Refresh page

    } catch (error: any) {
        setError(error.message || "An unknown error occurred.");
        console.error("Error adding vlucht cyclus:", error);
        // Keep dialog open by not calling setIsOpen(false) on error
    } finally {
        setIsLoading(false);
    }
}

export default { handleDelete, handleAddVluchtCyclus, getVluchtCycli };