"use client";
{ /* TODO: Use shadcn/ui components for the time inputs */ }

import React, { useState } from 'react';
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
import { PlusCircle } from 'lucide-react';
import useEvents from '@/hooks/useEvents'; // Assuming you moved the hook logic
import { Event } from '@/app/types'; // Import type

// Define the specific form data structure needed here
interface EventFormData {
  naam: string;
  start_datum: string; // YYYY-MM-DD
  eind_datum: string;  // YYYY-MM-DD
  start_tijd: string;  // HH:MM
  tijdsduur: string; // HH:MM
}

// Define the type for the data needed to create an event (matches EventInput in hook)
type EventInput = Omit<Event, 'id'>;


export function AddEventDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize state with correct types (strings)
  const [formData, setFormData] = useState<EventFormData>({
    naam: '',
    start_datum: '', // Initialize as empty string
    eind_datum: '',  // Initialize as empty string
    start_tijd: '',  // Initialize as empty string
    tijdsduur: ''   // Initialize as empty string
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value, // Value from date/time inputs is already string
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data before submit:", formData);
    // Cast formData to EventInput type expected by handleAddEvent
    // This assumes EventInput uses string types for dates/times as well
    const eventInputData: EventInput = {
        ...formData
    };
    useEvents.handleAddEvent(eventInputData, setIsSubmitting, setError, setIsOpen, (resetData) => setFormData(resetData as EventFormData));
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
              <Label htmlFor="naam" className="text-right">Name</Label>
              <Input id="naam" value={formData.naam} onChange={handleInputChange} className="col-span-3" required />
            </div>

            {/* Start Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start_datum" className="text-right">Start Date</Label>
              <Input id="start_datum" type="date" value={formData.start_datum} onChange={handleInputChange} className="col-span-3" required />
            </div>

            {/* Start Time */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start_tijd" className="text-right">Start Time</Label>
              <Input id="start_tijd" type="time" value={formData.start_tijd} onChange={handleInputChange} className="col-span-3" required />
            </div>

            {/* End Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eind_datum" className="text-right">End Date</Label>
              <Input id="eind_datum" type="date" value={formData.eind_datum} onChange={handleInputChange} className="col-span-3" required />
            </div>

            {/* Duration */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tijdsduur" className="text-right">Duration</Label>
              <Input id="tijdsduur" type="time" value={formData.tijdsduur} onChange={handleInputChange} className="col-span-3" required step="1" /> {/* Added step="1" to encourage seconds, though input might not show them */}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}