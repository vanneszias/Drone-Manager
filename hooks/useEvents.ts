import { Event } from '@/app/types'; // Import the updated Event type

// Define the type for the data *received* by handleAddEvent from the dialog
// and *sent* to the API - MUST BE snake_case to match the backend endpoint body.
interface EventInput {
    naam: string;
    start_datum: string; // YYYY-MM-DD
    eind_datum: string;  // YYYY-MM-DD
    start_tijd: string;  // HH:MM[:SS] - backend expects ISO format
    tijdsduur: string; // HH:MM[:SS] - backend expects ISO format
}

const apiUrl = 'https://drone.ziasvannes.tech/api/events';

// Function to fetch events from the API
async function getEvents(): Promise<Event[]> {
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
            throw new Error(`Failed to fetch events. Status: ${res.status}. Check server logs.`);
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
        return data as Event[]; // Assuming API returns camelCase or matches Event type

    } catch (error) {
        console.error(`Error in getEvents fetching ${apiUrl}:`, error);
        // Re-throw the error so Next.js can handle it (e.g., show error.tsx)
        throw error;
    }
}

const handleDelete = async (id: number) => {
    if (!confirm(`Are you sure you want to delete event ${id}?`)) return;
    try {
        const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert('Event deleted successfully');
            // TODO: Refresh data - Need a better way, e.g., router.refresh() or state management
            window.location.reload(); // Simple but not ideal
        } else {
            const errorData = await res.json();
            alert(`Failed to delete event: ${errorData.error || res.statusText}`);
        }
    } catch (error) {
        console.error("Error deleting event:", error);
        alert("An error occurred while deleting the event.");
    }
};


const handleAddEvent = async (
    formData: EventInput, // Use EventInput type
    setIsLoading: (isLoading: boolean) => void,
    setError: (error: string | null) => void,
    setIsOpen: (isOpen: boolean) => void,
    setFormData: (formData: EventInput) => void // Use EventInput type for reset
) => {
    setIsLoading(true);
    setError(null);

    // Basic validation (add checks for time fields too)
    if (!formData.naam || !formData.start_datum || !formData.eind_datum || !formData.start_tijd || !formData.tijdsduur) {
        setError("All fields (Name, Start Date, End Date, Start Time, Duration) are required.");
        setIsLoading(false);
        return;
    }

    // Prepare data for API (match expected fields in api/app.py create_event)
    // Ensure time format includes seconds if needed by backend
    const apiData = {
        naam: formData.naam,
        start_datum: formData.start_datum, // Should be YYYY-MM-DD from input
        eind_datum: formData.eind_datum,   // Should be YYYY-MM-DD from input
        start_tijd: formData.start_tijd.includes(':') ? formData.start_tijd + (formData.start_tijd.split(':').length === 2 ? ':00' : '') : '00:00:00', // Ensure HH:MM:SS
        tijdsduur: formData.tijdsduur.includes(':') ? formData.tijdsduur + (formData.tijdsduur.split(':').length === 2 ? ':00' : '') : '00:00:00', // Ensure HH:MM:SS
    };

    try {
        console.log("Sending data to API:", apiData); // Log the data being sent
        const response = await fetch(apiUrl, { // Use relative path
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apiData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error Response:", errorData); // Log backend error
            // Try to grab the specific error from the backend response
            let specificError = "Failed to add event.";
            if (errorData && errorData.error) {
                // Check for common Python errors passed back
                if (errorData.error.includes("Invalid isoformat string")) {
                    specificError = "Invalid date or time format provided.";
                } else if (errorData.error.includes("KeyError")) {
                    specificError = `Missing required field: ${errorData.error.split("'")[1]}`;
                } else {
                    specificError = errorData.error;
                }
            } else {
                specificError = `HTTP error! status: ${response.status} ${response.statusText}`;
            }
            throw new Error(specificError);
        }

        // Success
        const newEvent = await response.json(); // Optional: get the created event back
        console.log("Event added successfully:", newEvent);
        setIsOpen(false); // Close dialog
        // Reset form using EventInput type (no id)
        setFormData({ naam: '', start_datum: '', eind_datum: '', start_tijd: '', tijdsduur: '' });
        alert('Event added successfully!');
        // TODO: Ideally refresh data without full page reload
        window.location.reload(); // Simple refresh
    } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
        console.error("Error adding event:", err);
    } finally {
        setIsLoading(false);
    }
};



export default { getEvents, handleDelete, handleAddEvent };
