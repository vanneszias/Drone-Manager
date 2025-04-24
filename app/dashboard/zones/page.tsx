"use client";

import React, { useState, useEffect } from "react";
import ZoneList from "@/components/dashboard/zones/zone-list";
import { AddZoneDialog } from "@/components/dashboard/zones/add-zone-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useZones from "@/hooks/useZones";
import { Button } from "@/components/ui/button";
import { Zone } from "@/app/types";

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getZones } = useZones;

  useEffect(() => {
    const loadZones = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getZones();
        setZones(data);
      } catch (err) {
        console.error("Error in loadZones:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Er is een fout opgetreden bij het laden van de zones"
        );
      } finally {
        setLoading(false);
      }
    };

    loadZones();
  }, [getZones]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Zones laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive font-semibold">
            Error bij het laden van zones
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
              <CardTitle>Zone Beheer</CardTitle>
              <CardDescription>
                Overzicht van alle zones ({zones.length})
              </CardDescription>
            </div>
            <AddZoneDialog />
          </div>
        </CardHeader>
        <CardContent>
          <ZoneList zones={zones} />
        </CardContent>
      </Card>
    </div>
  );
}
