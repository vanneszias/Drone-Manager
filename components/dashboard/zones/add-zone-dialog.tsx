"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zone } from '@/app/types';
import { PlusCircle } from 'lucide-react';
import useZones from '@/hooks/useZones';

// Basic type for form data
interface ZoneFormData {
  naam: string;
  breedte: number | string; // Use string initially for input, convert later
  lengte: number | string;  // Use string initially for input, convert later
  evenement_id: number | string; // Use string initially for input, convert later
}

// Type for data sent to API (matching backend expectations AFTER fix)
interface ZoneApiInput {
   naam: string;
   breedte: number;
   lengte: number;
   evenement_id: number;
}

export function AddZoneDialog() { // Consider accepting eventId as a prop: { eventId }: { eventId?: number }
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ZoneFormData>({
    naam: '',
    breedte: '',
    lengte: '',
    evenement_id: '', // Or pre-fill if eventId prop is passed
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value, // Keep as string from input for now
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // --- Data Conversion and Validation ---
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
         // TODO: Add better validation/selection for Event ID
        setError("Please enter a valid Event ID.");
        return;
    }

    const apiData: ZoneApiInput = {
        naam: formData.naam,
        breedte: breedteNum,
        lengte: lengteNum,
        evenement_id: evenementIdNum,
    };

    // Call the hook with the correctly structured data
    useZones.handleAddZone(apiData, setIsLoading, setError, setIsOpen, () => setFormData({ naam: '', breedte: '', lengte: '', evenement_id: '' }));
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
              <Label htmlFor="naam" className="text-right">Name</Label>
              <Input id="naam" value={formData.naam} onChange={handleInputChange} className="col-span-3" required />
            </div>
             {/* Breedte (Width) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="breedte" className="text-right">Width</Label>
              <Input id="breedte" type="number" value={formData.breedte} onChange={handleInputChange} className="col-span-3" required step="any" min="0.01"/>
            </div>
             {/* Lengte (Length) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lengte" className="text-right">Length</Label>
              <Input id="lengte" type="number" value={formData.lengte} onChange={handleInputChange} className="col-span-3" required step="any" min="0.01"/>
            </div>
             {/* Evenement ID (Event ID) - NEEDS BETTER UX (e.g., Dropdown) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="evenement_id" className="text-right">Event ID</Label>
              <Input id="evenement_id" type="number" value={formData.evenement_id} onChange={handleInputChange} className="col-span-3" required min="1"/>
              {/* TODO: Replace this with a Select dropdown populated from /api/events */}
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Zone'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
