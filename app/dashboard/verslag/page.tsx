"use client";

import { useEffect, useState } from "react";
import { Verslag } from "@/app/types";
import { VerslagList } from "@/components/dashboard/verslag/verslag-list";
import { Button } from "@/components/ui/button";
import { AddVerslagDialog } from "@/components/dashboard/verslag/add-verslag-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useVerslag from "@/hooks/useVerslag";

export default function VerslagPage() {
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive font-semibold">Error loading verslagen</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
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
          <CardContent className="flex justify-center items-center min-h-[400px]">
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