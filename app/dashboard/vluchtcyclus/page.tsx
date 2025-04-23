"use client";

import { useEffect, useState } from "react";
import { VluchtCyclus } from "@/app/types";
import VluchtCyclusList from "@/components/dashboard/vluchtcyclus/vluchtcyclus-list";
import { Button } from "@/components/ui/button";
import { AddVluchtCyclusDialog } from "@/components/dashboard/vluchtcyclus/add-vluchtcyclus-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useVluchtCyclus from "@/hooks/useVluchtCyclus";

export default function VluchtCyclusPage() {
  const [vluchtcyclussen, setVluchtcyclussen] = useState<VluchtCyclus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getVluchtCyclussen } = useVluchtCyclus;

  useEffect(() => {
    const loadVluchtCyclussen = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getVluchtCyclussen();
        setVluchtcyclussen(data);
      } catch (err) {
        console.error('Error in loadVluchtCyclussen:', err);
        setError(err instanceof Error ? err.message : 'Failed to load vluchtcyclussen');
      } finally {
        setLoading(false);
      }
    };

    loadVluchtCyclussen();
  }, [getVluchtCyclussen]);

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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive font-semibold">Error loading vluchtcyclussen</p>
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
          <VluchtCyclusList vluchtcyclussen={vluchtcyclussen} />
        </CardContent>
      </Card>
    </div>
  );
}