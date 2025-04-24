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

interface EventFormData {
  naam: string;
  start_datum: string; // YYYY-MM-DD
  eind_datum: string; // YYYY-MM-DD
  start_tijd: string; // HH:MM[:SS]
  tijdsduur: string; // HH:MM[:SS]
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
    naam: "",
    start_datum: "",
    eind_datum: "",
    start_tijd: "", // Initialize time strings, ensure format is handled on submit
    tijdsduur: "", // Initialize time strings, ensure format is handled on submit
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
    setError(null); // Clear previous errors
    console.log("Form Data before submit:", formData);

    // The formData already matches the snake_case structure the API expects (EventApiInput)
    // No casting needed here, just pass the formData directly.
    const eventApiInputData = {
      Id: 0, // temporary ID that will be set by the backend
      Naam: formData.naam,
      StartDatum: formData.start_datum,
      EindDatum: formData.eind_datum,
      StartTijd: formData.start_tijd,
      Tijdsduur: formData.tijdsduur,
    };

    // Pass the correctly structured PascalCase data to the hook
    useEvents.handleAddEvent(
      eventApiInputData,
      setIsSubmitting,
      setError,
      setIsOpen,
      // Map the resetData to match EventFormData structure
      (resetData) =>
        setFormData({
          naam: "",
          start_datum: "",
          eind_datum: "",
          start_tijd: "",
          tijdsduur: "",
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
                value={formData.naam}
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
                value={formData.start_datum}
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
                value={formData.start_tijd}
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
                value={formData.eind_datum}
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
                value={formData.tijdsduur}
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
