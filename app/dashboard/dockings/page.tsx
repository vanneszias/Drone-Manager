"use client";

import React, { useState, useEffect } from "react";
import DockingList from "@/components/dashboard/dockings/docking-list";
import { AddDockingDialog } from "@/components/dashboard/dockings/add-dockings-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useDockings from "@/hooks/useDockings";
import { Button } from "@/components/ui/button";
import { Docking } from "@/app/types";

export default function DockingsPage() {
  const [dockings, setDockings] = useState<Docking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getDockings } = useDockings;

  useEffect(() => {
    const loadDockings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDockings();
        setDockings(data);
      } catch (err) {
        console.error("Error in loadDockings:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Er is een fout opgetreden bij het laden van de dockings"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDockings();
  }, [getDockings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            Dockingplatformen laden...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive font-semibold">
            Error bij het laden van dockingplatformen
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
              <CardTitle>Dockingplatform Beheer</CardTitle>
              <CardDescription>
                Overzicht van alle dockingplatformen ({dockings.length})
              </CardDescription>
            </div>
            <AddDockingDialog />
          </div>
        </CardHeader>
        <CardContent>
          <DockingList dockings={dockings} />
        </CardContent>
      </Card>
    </div>
  );
}
