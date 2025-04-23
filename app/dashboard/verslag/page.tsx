import React from 'react';
import { VerslagList } from "@/components/dashboard/verslag/verslag-list";
import { AddVerslagDialog } from "@/components/dashboard/verslag/add-verslag-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Keep Card imports
import useVerslag from "@/hooks/useVerslag";
import { Verslag } from '@/app/types';

/* // Remove client-side fetching logic
  const [verslagen, setVerslagen] = useState<Verslag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getVerslagen } = useVerslag;

  useEffect(() => {
    const loadVerslagen = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getVerslagen();
        setVerslagen(data);
      } catch (err) {
        console.error('Error in loadVerslagen:', err);
        setError(err instanceof Error ? err.message : 'Failed to load verslagen');
      } finally {
        setLoading(false);
      }
    };

    loadVerslagen();
  }, [getVerslagen]);
*/

export default async function VerslagPage() {
  const { getVerslagen } = useVerslag;

  let verslagen: Verslag[] = [];
  let error: string | null = null;

  /* // Loading state handled by Server Component Suspense or page transition
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading verslagen...</p>
        </div>
      </div>
    );
  }
  */
  try {
    verslagen = await getVerslagen();
  } catch (err) {
    console.error('Error fetching verslagen:', err);
    error = err instanceof Error ? err.message : 'Failed to load verslagen';
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center text-red-500">
        <h1 className="text-2xl font-bold mb-4">Error Loading Verslagen</h1>
        <p>{error}</p>
        <p className="mt-4">
          Please check the API connection and database.
          {/* Retry mechanism needs client-side JS or library */}
          {/* <button
              onClick={() => window.location.reload()} // Simple retry for now
              className="ml-2 px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
              Retry
          </button> */}
        </p>
      </div>
    );
  }

  if (verslagen.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Verslagen</CardTitle>
                <CardDescription>
                  Geen verslagen gevonden
                </CardDescription>
              </div>
              <AddVerslagDialog />
            </div>
          </CardHeader>
          <CardContent className="flex justify-center items-center min-h-[200px]">
            <div className="text-center">
              <p className="text-muted-foreground">Nog geen verslagen beschikbaar</p>
              <p className="text-sm text-muted-foreground mt-1">Klik op 'Add Verslag' om een nieuw verslag toe te voegen</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Verslagen</CardTitle>
              <CardDescription>
                Overzicht van alle verslagen ({verslagen.length})
              </CardDescription>
            </div>
            <AddVerslagDialog />
          </div>
        </CardHeader>
        <CardContent>
          <VerslagList verslagen={verslagen} />
        </CardContent>
      </Card>
    </div>
  );
}