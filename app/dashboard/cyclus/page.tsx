"use client";

import { useEffect, useState } from "react";
import { Cyclus } from "@/app/types";
import CyclusList from "@/components/dashboard/cyclus/cyclus-list";
import { AddCyclusDialog } from "@/components/dashboard/cyclus/add-cyclus-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useCyclus from "@/hooks/useCyclus";
import { Button } from "@/components/ui/button";

export default function CyclusPage() {
  const [cycli, setCycli] = useState<Cyclus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getCycli } = useCyclus;

  useEffect(() => {
    const loadCycli = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCycli();
        setCycli(data);
      } catch (err) {
        console.error('Error in loadCycli:', err);
        setError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het laden van de cycli');
      } finally {
        setLoading(false);
      }
    };

    loadCycli();
  }, [getCycli]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cycli laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive font-semibold">Error bij het laden van cycli</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Opnieuw proberen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Cyclus Beheer</CardTitle>
              <CardDescription>
                Overzicht van alle cycli ({cycli.length})
              </CardDescription>
            </div>
            <AddCyclusDialog />
          </div>
        </CardHeader>
        <CardContent>
          <CyclusList cycli={cycli} />
        </CardContent>
      </Card>
    </div>
  );
}