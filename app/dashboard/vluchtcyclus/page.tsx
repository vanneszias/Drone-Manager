import React from 'react';
import VluchtCyclusList from "@/components/dashboard/vluchtcyclus/vluchtcyclus-list";
import { AddVluchtCyclusDialog } from "@/components/dashboard/vluchtcyclus/add-vluchtcyclus-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Keep Card imports
import useVluchtCyclus from "@/hooks/useVluchtCyclus";
import { VluchtCyclus } from "@/app/types";

/* // Remove client-side fetching logic
  const [vluchtcyclussen, setVluchtcyclussen] = useState<VluchtCyclus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getVluchtCycli } = useVluchtCyclus;

  useEffect(() => {
    const loadVluchtCycli = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getVluchtCycli();
        setVluchtcyclussen(data);
      } catch (err) {
        console.error('Error in loadVluchtCycli:', err);
        setError(err instanceof Error ? err.message : 'Failed to load vluchtcycli');
      } finally {
        setLoading(false);
      }
    };

    loadVluchtCycli();
  }, [getVluchtCycli]);
*/

export default async function VluchtCyclusPage() {
  const { getVluchtCycli } = useVluchtCyclus;
  let vluchtcyclussen: VluchtCyclus[] = [];
  let error: string | null = null;

  /* // Loading state handled by Server Component Suspense or page transition
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading vluchtcyclussen...</p>
        </div>
      </div>
    );
  }
  */
  try {
    vluchtcyclussen = await getVluchtCycli();
  } catch (err) {
    console.error('Error fetching VluchtCycli:', err);
    error = err instanceof Error ? err.message : 'Failed to load VluchtCycli';
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center text-red-500">
        <h1 className="text-2xl font-bold mb-4">Error Loading Vlucht Cycli</h1>
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

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Vluchtcyclus Beheer</CardTitle>
              <CardDescription>
                Overzicht van alle vluchtcyclussen ({vluchtcyclussen.length})
              </CardDescription>
            </div>
            <AddVluchtCyclusDialog />
          </div>
        </CardHeader>
        <CardContent>
          {vluchtcyclussen.length > 0 ? (
            <VluchtCyclusList vluchtCycli={vluchtcyclussen} />
          ) : (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="text-center">
                <p className="text-muted-foreground">Geen vluchtcyclussen gevonden.</p>
                <p className="text-sm text-muted-foreground mt-1">Klik op 'Nieuwe Vluchtcyclus' om er een toe te voegen.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}