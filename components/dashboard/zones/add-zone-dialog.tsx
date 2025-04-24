"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zone, Evenement } from "@/app/types";
import { PlusCircle } from "lucide-react";
import useZones from "@/hooks/useZones";

// Basic type for form data
interface ZoneFormData {
  naam: string;
  breedte: number | string;
  lengte: number | string;
  evenement_id: number | string;
}

export function AddZoneDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ZoneFormData>({
    naam: "",
    breedte: "",
    lengte: "",
    evenement_id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Evenement[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadEvents = async () => {
        setEventsLoading(true);
        try {
          const fetchedEvents = await useZones.fetchEvents();
          setEvents(fetchedEvents);
        } catch (error) {
          console.error("Failed to load events:", error);
          setError(error instanceof Error ? error.message : "Failed to load events");
          setEvents([]);
        } finally {
          setEventsLoading(false);
        }
      };
      loadEvents();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleEventSelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      evenement_id: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Data Conversion and Validation
    const breedteNum = parseFloat(formData.breedte.toString());
    const lengteNum = parseFloat(formData.lengte.toString());
    const evenementIdNum = parseInt(formData.evenement_id.toString(), 10);

    if (!formData.naam) {
      setError("Zone name is required.");
      return;
    }
    if (isNaN(breedteNum) || breedteNum <= 0) {
      setError("Please enter a valid positive number for Width.");
      return;
    }
    if (isNaN(lengteNum) || lengteNum <= 0) {
      setError("Please enter a valid positive number for Length.");
      return;
    }
    if (isNaN(evenementIdNum) || evenementIdNum <= 0) {
      setError("Please select an event.");
      return;
    }

    const zoneData: Zone = {
      Id: 0,
      naam: formData.naam,
      breedte: breedteNum,
      lengte: lengteNum,
      EvenementId: evenementIdNum,
    };

    // Call the hook with the correctly structured data
    useZones.handleAddZone(zoneData, setIsLoading, setError, setIsOpen, () =>
      setFormData({ naam: "", breedte: "", lengte: "", evenement_id: "" })
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Zone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Zone</DialogTitle>
          <DialogDescription>
            Enter the details for the new zone. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="naam" className="text-right">
                Name
              </Label>
              <Input
                id="naam"
                value={formData.naam}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            {/* Breedte (Width) - Keep as is */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="breedte" className="text-right">
                Width
              </Label>
              <Input
                id="breedte"
                type="number"
                value={formData.breedte}
                onChange={handleInputChange}
                className="col-span-3"
                required
                step="any"
                min="0.01"
              />
            </div>
            {/* Lengte (Length) - Keep as is */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lengte" className="text-right">
                Length
              </Label>
              <Input
                id="lengte"
                type="number"
                value={formData.lengte}
                onChange={handleInputChange}
                className="col-span-3"
                required
                step="any"
                min="0.01"
              />
            </div>
            {/* Evenement Selection - Replace input with dropdown */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="evenement_id" className="text-right">
                Event
              </Label>
              <div className="col-span-3">
                <Select 
                  value={formData.evenement_id.toString()} 
                  onValueChange={handleEventSelect}
                  disabled={eventsLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventsLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading events...
                      </SelectItem>
                    ) : events.length > 0 ? (
                      events.map((event) => (
                        <SelectItem key={event.Id} value={event.Id.toString()}>
                          {event.Naam || `Event #${event.Id}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No events available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || eventsLoading}>
              {isLoading ? "Saving..." : "Save Zone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}