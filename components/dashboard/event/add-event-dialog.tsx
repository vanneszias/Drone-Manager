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
import { Event } from "@/app/types";  // Add this import

interface EventFormData extends Omit<Event, 'Id'> {
  Naam: string;
  StartDatum: string;
  EindDatum: string;
  StartTijd: string;
  Tijdsduur: string;
}

// Define the type for the data *sent* to the API (matches backend expectation)
// This is effectively the same as EventFormData in this case.
type EventApiInput = EventFormData;

export function AddEventDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize state with the correct snake_case structure
  const [formData, setFormData] = useState<EventFormData>({
    Naam: "",
    StartDatum: "",
    EindDatum: "",
    StartTijd: "", // Initialize time strings, ensure format is handled on submit
    Tijdsduur: "", // Initialize time strings, ensure format is handled on submit
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value, // Value from date/time inputs is already string
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all required fields are present and not empty
    const requiredFields = {
      Naam: formData.Naam?.trim(),
      StartDatum: formData.StartDatum?.trim(),
      EindDatum: formData.EindDatum?.trim(),
      StartTijd: formData.StartTijd?.trim(),
      Tijdsduur: formData.Tijdsduur?.trim(),
    };

    const emptyFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      setError(`Missing required fields: ${emptyFields.join(", ")}`);
      return;
    }

    // Validate dates
    const startDate = new Date(formData.StartDatum);
    const endDate = new Date(formData.EindDatum);

    if (isNaN(startDate.getTime())) {
      setError("Please enter a valid start date");
      return;
    }
    if (isNaN(endDate.getTime())) {
      setError("Please enter a valid end date");
      return;
    }
    if (endDate < startDate) {
      setError("End date cannot be before start date");
      return;
    }

    const trimmedFormData = {
      ...formData,
      Naam: formData.Naam.trim(),
      StartDatum: formData.StartDatum.trim(),
      EindDatum: formData.EindDatum.trim(),
      StartTijd: formData.StartTijd.trim(),
      Tijdsduur: formData.Tijdsduur.trim(),
    };

    const eventApiInputData: Event = {
      Id: 0,
      ...trimmedFormData
    };

    useEvents.handleAddEvent(
      eventApiInputData,
      setIsSubmitting,
      setError,
      setIsOpen,
      () => setFormData({
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
              <Label htmlFor="Naam" className="text-right">
                Name
              </Label>
              <Input
                id="Naam"
                value={formData.Naam}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            {/* Start Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="StartDatum" className="text-right">
                Start Date
              </Label>
              <Input
                id="StartDatum"
                type="date"
                value={formData.StartDatum}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            {/* Start Time */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="StartTijd" className="text-right">
                Start Time
              </Label>
              <Input
                id="StartTijd"
                type="time"
                value={formData.StartTijd}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            {/* End Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="EindDatum" className="text-right">
                End Date
              </Label>
              <Input
                id="EindDatum"
                type="date"
                value={formData.EindDatum}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            {/* Duration */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Tijdsduur" className="text-right">
                Duration
              </Label>
              <Input
                id="Tijdsduur"
                type="time"
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
