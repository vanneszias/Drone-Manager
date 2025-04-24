"use client";

import React, { useState, useEffect } from "react";
import DockingCyclusList from "@/components/dashboard/dockingcyclus/dockingcyclus-list";
import { AddDockingCyclusDialog } from "@/components/dashboard/dockingcyclus/add-dockingcyclus-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useDockingCyclus from "@/hooks/useDockingCyclus";
import { Button } from "@/components/ui/button";
import { DockingCyclus } from "@/app/types";

export default function DockingCyclusPage() {
  const [dockingCyclus, setDockingCyclus] = useState<DockingCyclus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getDockingCycli } = useDockingCyclus;

  useEffect(() => {
    const loadDockingCyclus = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDockingCycli();
        setDockingCyclus(data);
      } catch (err) {
        console.error("Error in loadDockingCyclus:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Er is een fout opgetreden bij het laden van de docking cycli"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDockingCyclus();
  }, [getDockingCycli]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Docking cycli laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive font-semibold">
            Error bij het laden van docking cycli
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
              <CardTitle>Docking Cyclus Beheer</CardTitle>
              <CardDescription>
                Overzicht van alle docking cycli ({dockingCyclus.length})
              </CardDescription>
            </div>
            <AddDockingCyclusDialog />
          </div>
        </CardHeader>
        <CardContent>
          <DockingCyclusList dockingCycli={dockingCyclus} />
        </CardContent>
      </Card>
    </div>
  );
}
