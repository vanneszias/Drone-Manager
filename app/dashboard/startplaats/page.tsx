"use client";

import React, { useState, useEffect } from "react";
import StartplaatsList from "@/components/dashboard/startplaats/startplaats-list";
import { AddStartplaatsDialog } from "@/components/dashboard/startplaats/add-startplaats-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useStartplaats from "@/hooks/useStartplaats";
import { Button } from "@/components/ui/button";
import { Startplaats } from "@/app/types";

export default function StartplaatsPage() {
  const [startplaatsen, setStartplaatsen] = useState<Startplaats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getStartplaatsen } = useStartplaats;

  useEffect(() => {
    const loadStartplaatsen = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStartplaatsen();
        setStartplaatsen(data);
      } catch (err) {
        console.error("Error in loadStartplaatsen:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Er is een fout opgetreden bij het laden van de startplaatsen"
        );
      } finally {
        setLoading(false);
      }
    };

    loadStartplaatsen();
  }, [getStartplaatsen]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Startplaatsen laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive font-semibold">
            Error bij het laden van startplaatsen
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
              <CardTitle>Startplaats Beheer</CardTitle>
              <CardDescription>
                Overzicht van alle startplaatsen ({startplaatsen.length})
              </CardDescription>
            </div>
            <AddStartplaatsDialog />
          </div>
        </CardHeader>
        <CardContent>
          <StartplaatsList startplaatsen={startplaatsen} />
        </CardContent>
      </Card>
    </div>
  );
}
