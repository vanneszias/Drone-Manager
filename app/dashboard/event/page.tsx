"use client";

import React, { useState, useEffect } from "react";
import EventList from "@/components/dashboard/event/event-list";
import { AddEventDialog } from "@/components/dashboard/event/add-event-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useEvents from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";
import { Event } from "@/app/types";

export default function EventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getEvents } = useEvents;

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Error in loadEvents:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Er is een fout opgetreden bij het laden van de evenementen"
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [getEvents]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Evenementen laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive font-semibold">
            Error bij het laden van evenementen
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
              <CardTitle>Evenement Beheer</CardTitle>
              <CardDescription>
                Overzicht van alle evenementen ({events.length})
              </CardDescription>
            </div>
            <AddEventDialog />
          </div>
        </CardHeader>
        <CardContent>
          <EventList events={events} />
        </CardContent>
      </Card>
    </div>
  );
}
