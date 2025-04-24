"use client";

import React, { useState, useEffect } from "react";
import VluchtCyclusList from "@/components/dashboard/vluchtcyclus/vluchtcyclus-list";
import { AddVluchtCyclusDialog } from "@/components/dashboard/vluchtcyclus/add-vluchtcyclus-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useVluchtCyclus from "@/hooks/useVluchtCyclus";
import { Button } from "@/components/ui/button";
import { VluchtCyclus } from "@/app/types";

export default function VluchtCyclusPage() {
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
        console.error("Error in loadVluchtCycli:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Er is een fout opgetreden bij het laden van de vluchtcyclussen"
        );
      } finally {
        setLoading(false);
      }
    };

    loadVluchtCycli();
  }, [getVluchtCycli]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Vluchtcyclussen laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive font-semibold">
            Error bij het laden van vluchtcyclussen
          </p>
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
              <CardTitle>Vluchtcyclus Beheer</CardTitle>
              <CardDescription>
                Overzicht van alle vluchtcyclussen ({vluchtcyclussen.length})
              </CardDescription>
            </div>
            <AddVluchtCyclusDialog />
          </div>
        </CardHeader>
        <CardContent>
          <VluchtCyclusList vluchtCycli={vluchtcyclussen} />
        </CardContent>
      </Card>
    </div>
  );
}
