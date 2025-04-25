"use client";
import React, { useState } from "react";
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
import { PlusCircle } from "lucide-react";
import useEvents from "@/hooks/useEvents"; // Hook for API calls

import { Event } from "@/app/types";

export function AddEventDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Event>({
    Id: 0,
    Naam: "",
    StartDatum: "",
    EindDatum: "",
    StartTijd: "",
    Tijdsduur: "",
  });

  // Function to ensure time string is in HH:mm:ss format
  const formatTimeString = (time: string): string => {
    if (!time) return "";
    // If time is just HH:mm, append :00 for seconds
    if (time.length === 5) {
      return `${time}:00`;
    }
    return time;
  };

  // Function to validate dates
  const validateDates = (): string | null => {
    const startDate = new Date(formData.StartDatum);
    const endDate = new Date(formData.EindDatum);

    if (endDate < startDate) {
      return "End date cannot be before start date";
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Convert from HTML input IDs to PascalCase for state
    const fieldMapping: { [key: string]: keyof Event } = {
      naam: "Naam",
      start_datum: "StartDatum",
      eind_datum: "EindDatum",
      start_tijd: "StartTijd",
      tijdsduur: "Tijdsduur",
    };

    const stateKey = fieldMapping[id];
    if (stateKey) {
      setFormData((prev) => ({
        ...prev,
        [stateKey]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate dates
    const dateError = validateDates();
    if (dateError) {
      setError(dateError);
      return;
    }

    // Format times to ensure HH:mm:ss format
    const eventData: Event = {
      ...formData,
      StartTijd: formatTimeString(formData.StartTijd),
      Tijdsduur: formatTimeString(formData.Tijdsduur),
    };

    useEvents.handleAddEvent(
      eventData,
      setIsSubmitting,
      setError,
      setIsOpen,
      () =>
        setFormData({
          Id: 0,
          Naam: "",
          StartDatum: "",
          EindDatum: "",
          StartTijd: "",
          Tijdsduur: "",
        })
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Enter the details for the new event. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-sm text-red-500 mb-4 px-1">{error}</p>}
          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              {/* Use snake_case for htmlFor to match input id */}
              <Label htmlFor="naam" className="text-right">
                Name
              </Label>
              <Input
                id="naam"
                value={formData.Naam}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            {/* Start Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start_datum" className="text-right">
                Start Date
              </Label>
              <Input
                id="start_datum"
                type="date"
                value={formData.StartDatum}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            {/* Start Time */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start_tijd" className="text-right">
                Start Time
              </Label>
              <Input
                id="start_tijd"
                type="time"
                step="1"
                value={formData.StartTijd}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            {/* End Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eind_datum" className="text-right">
                End Date
              </Label>
              <Input
                id="eind_datum"
                type="date"
                value={formData.EindDatum}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            {/* Duration */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tijdsduur" className="text-right">
                Duration
              </Label>
              <Input
                id="tijdsduur"
                type="time"
                step="1"
                value={formData.Tijdsduur}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
