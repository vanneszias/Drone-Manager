"use client";

// 1. Importeren van benodigde modules en componenten
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
import { DockingCyclus } from '@/app/types'; // DockingCyclus type
import { PlusCircle } from 'lucide-react'; // Icon
import useDockingCyclus from '@/hooks/useDockingCyclus'; // Hook voor API-aanroepen

// 2. Definiëren van het formuliertype
type DockingCyclusFormData = {
  status: DockingCyclus['status'];
  locatie: string;
  capaciteit: number;
};

// 3. Hoofdcomponent
export function AddDockingCyclusDialog() {
  // 4. State voor formulierbeheer
  const [isOpen, setIsOpen] = useState(false); // Dialoog open/gesloten
  const [formData, setFormData] = useState<Partial<DockingCyclusFormData>>({
    status: 'AVAILABLE', // Standaardstatus
    locatie: '',
    capaciteit: 0,
  });
  const [isLoading, setIsLoading] = useState(false); // Laadstatus
  const [error, setError] = useState<string | null>(null); // Foutmelding

  // 5. Inputveranderingen verwerken
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'number' ? Number(value) : value,
    }));
  };

  // 6. Selectieveranderingen verwerken
  const handleSelectChange = (value: DockingCyclus['status']) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  // 7. Formulierverzending verwerken
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { handleAddDockingCyclus } = useDockingCyclus();
    handleAddDockingCyclus(
      formData as DockingCyclus,
      setIsLoading,
      setError,
      setIsOpen,
      setFormData
    );
  };

  // 8. Renderen van de dialoog
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* 9. Triggerknop */}
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Docking Cyclus
        </Button>
      </DialogTrigger>

      {/* 10. Dialooginhoud */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Docking Cyclus</DialogTitle>
          <DialogDescription>
            Enter the details for the new docking cyclus. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {/* 11. Formulier */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Locatieveld */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locatie" className="text-right">Location</Label>
              <Input
                id="locatie"
                value={formData.locatie || ''}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            {/* Capaciteitsveld */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capaciteit" className="text-right">Capacity</Label>
              <Input
                id="capaciteit"
                type="number"
                min="0"
                value={formData.capaciteit ?? ''}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            {/* Statusselectie */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select onValueChange={handleSelectChange} defaultValue={formData.status}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="IN_USE">In Use</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="OFFLINE">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Foutmelding */}
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          {/* Voettekst met knoppen */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Docking Cyclus'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}