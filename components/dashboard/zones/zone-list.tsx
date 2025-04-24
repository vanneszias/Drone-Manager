"use client";

import React, { useState, useEffect } from "react";
import { Zone, Evenement } from "@/app/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import useZones from "@/hooks/useZones";
import { EditZoneDialog } from "./edit-zone-dialog";

interface ZoneListProps {
  zones: Zone[];
}

export default function ZoneList({ zones }: ZoneListProps) {
  const { handleDelete, fetchEvents } = useZones;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [events, setEvents] = useState<Evenement[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventData = await fetchEvents();
        setEvents(eventData);
      } catch (error) {
        console.error("Error loading events:", error);
      }
    };
    loadEvents();
  }, [fetchEvents]);

  const getEventName = (evenementId: number | null) => {
    if (!evenementId) return "N/A";
    const event = events.find((e) => e.Id === evenementId);
    return event ? event.Naam : "N/A";
  };

  const handleEdit = (zone: Zone) => {
    setSelectedZone(zone);
    setIsEditOpen(true);
  };

  if (!zones || zones.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <p className="text-muted-foreground">Geen zones gevonden.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Klik op 'Nieuwe Zone' om er een toe te voegen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableCaption>Een lijst van alle zones.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Naam</TableHead>
            <TableHead>Breedte (m)</TableHead>
            <TableHead>Lengte (m)</TableHead>
            <TableHead>Evenement</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {zones.map((zone) => (
            <TableRow key={zone.Id}>
              <TableCell className="font-medium">{zone.Id}</TableCell>
              <TableCell>{zone.naam}</TableCell>
              <TableCell>{zone.breedte.toFixed(2)} m</TableCell>
              <TableCell>{zone.lengte.toFixed(2)} m</TableCell>
              <TableCell>{getEventName(zone.EvenementId)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={() => handleEdit(zone)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Bewerk zone</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(zone.Id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Verwijder zone</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Totaal Zones</TableCell>
            <TableCell className="text-right">{zones.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {selectedZone && (
        <EditZoneDialog
          zone={selectedZone}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
        />
      )}
    </>
  );
}
