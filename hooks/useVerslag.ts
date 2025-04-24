import { Verslag } from "@/app/types";

const apiUrl = "https://drone.ziasvannes.tech/api/verslagen";

async function getVerslagen(): Promise<Verslag[]> {
  console.log(`Server-side fetch initiated for: ${apiUrl}`);

  try {
    const res = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    console.log(`Fetch response status from ${apiUrl}: ${res.status}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `Error fetching ${apiUrl}: ${res.status} ${res.statusText}`
      );
      console.error(`Response body: ${errorText.substring(0, 500)}...`);
      throw new Error(
        `Failed to fetch verslagen. Status: ${res.status}. Check server logs.`
      );
    }

    const data = await res.json();
    return data as Verslag[];
  } catch (error) {
    console.error(`Error in getVerslagen:`, error);
    throw error;
  }
}

const handleDelete = async (id: number) => {
  if (!confirm(`Weet je zeker dat je verslag ${id} wilt verwijderen?`)) return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete verslag");
    }

    window.location.reload();
  } catch (error) {
    console.error("Error deleting verslag:", error);
    alert("Er is een fout opgetreden bij het verwijderen van het verslag.");
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

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        onderwerp: formData.onderwerp,
        inhoud: formData.inhoud,
        isverzonden: formData.isverzonden,
        isgeaccepteerd: formData.isgeaccepteerd,
        VluchtCyclusId: formData.VluchtCyclusId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to add verslag (${response.status})`
      );
    }

    setIsOpen(false);
    setFormData({
      onderwerp: "",
      inhoud: "",
      isverzonden: false,
      isgeaccepteerd: false,
      VluchtCyclusId: null,
    } as Verslag);

    alert("Verslag succesvol toegevoegd!");
    window.location.reload();
  } catch (error) {
    console.error("Error adding verslag:", error);
    setError(error instanceof Error ? error.message : "Failed to add verslag");
  } finally {
    setIsLoading(false);
  }
};

const handleUpdateVerslag = async (
  formData: Verslag,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setIsOpen: (isOpen: boolean) => void,
  setFormData: (formData: Verslag) => void
) => {
  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch(`${apiUrl}/${formData.Id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        onderwerp: formData.onderwerp,
        inhoud: formData.inhoud,
        isverzonden: formData.isverzonden,
        isgeaccepteerd: formData.isgeaccepteerd,
        VluchtCyclusId: formData.VluchtCyclusId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to update verslag (${response.status})`
      );
    }

    setIsOpen(false);
    setFormData({
      Id: 0,
      onderwerp: "",
      inhoud: "",
      isverzonden: false,
      isgeaccepteerd: false,
      VluchtCyclusId: null,
    } as Verslag);

    alert("Verslag successfully updated!");
    window.location.reload();
  } catch (error) {
    console.error("Error updating verslag:", error);
    setError(
      error instanceof Error ? error.message : "Failed to update verslag"
    );
  } finally {
    setIsLoading(false);
  }
};

export default {
  getVerslagen,
  handleDelete,
  handleAddVerslag,
  handleUpdateVerslag,
};
