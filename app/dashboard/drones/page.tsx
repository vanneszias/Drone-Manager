"use client";

import React, { useState, useEffect } from "react";
import DroneList from "@/components/dashboard/drones/drone-list";
import { AddDroneDialog } from "@/components/dashboard/drones/add-drone-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useDrones from "@/hooks/useDrones";
import { Button } from "@/components/ui/button";
import { Drone } from "@/app/types";

export default function DronesPage() {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getDrones } = useDrones;

  useEffect(() => {
    const loadDrones = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDrones();
        setDrones(data);
      } catch (err) {
        console.error("Error in loadDrones:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Er is een fout opgetreden bij het laden van de drones"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDrones();
  }, [getDrones]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Drones laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive font-semibold">
            Error bij het laden van drones
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
              <CardTitle>Drone Beheer</CardTitle>
              <CardDescription>
                Overzicht van alle drones ({drones.length})
              </CardDescription>
            </div>
            <AddDroneDialog />
          </div>
        </CardHeader>
        <CardContent>
          <DroneList drones={drones} />
        </CardContent>
      </Card>
    </div>
  );
}
