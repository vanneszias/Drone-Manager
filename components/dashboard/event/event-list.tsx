"use client";

import React, { useState } from "react";
import { Event } from "@/app/types";
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
import useEvents from "@/hooks/useEvents";
import { EditEventDialog } from "./edit-event-dialog";

interface EventListProps {
  events: Event[];
}

export default function EventList({ events }: EventListProps) {
  const { handleDelete } = useEvents;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsEditOpen(true);
  };

  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("nl-NL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      console.warn("Invalid date string:", dateString);
      return "N/A";
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <p className="text-muted-foreground">Geen evenementen gevonden.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Klik op 'Nieuw Evenement' om er een toe te voegen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Naam</TableHead>
            <TableHead>Start Datum</TableHead>
            <TableHead>Eind Datum</TableHead>
            <TableHead>Start Tijd</TableHead>
            <TableHead>Tijdsduur</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.Id}>
              <TableCell className="font-medium">{event.Id}</TableCell>
              <TableCell>{event.Naam}</TableCell>
              <TableCell>{formatDate(event.StartDatum)}</TableCell>
              <TableCell>{formatDate(event.EindDatum)}</TableCell>
              <TableCell>{event.StartTijd}</TableCell>
              <TableCell>{event.Tijdsduur}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={() => handleEdit(event)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Bewerk evenement</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(event.Id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Verwijder evenement</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>Totaal Evenementen</TableCell>
            <TableCell className="text-right">{events.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {selectedEvent && (
        <EditEventDialog
          event={selectedEvent}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
        />
      )}
    </>
  );
}
