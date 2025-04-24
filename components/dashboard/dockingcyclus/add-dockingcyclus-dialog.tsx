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
import { DockingCyclus } from '@/app/types';
import { PlusCircle } from 'lucide-react';
import useDockingCyclus from '@/hooks/useDockingCyclus';

type DockingCyclusFormData = {
  DroneId: number;
  DockingId: number;
  CyclusId: number;
};

export function AddDockingCyclusDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<DockingCyclusFormData>({
    DroneId: 0,
    DockingId: 0,
    CyclusId: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleAddDockingCyclus } = useDockingCyclus;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: parseInt(value) || 0,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate data
    if (!formData.DroneId || !formData.DockingId || !formData.CyclusId) {
      setError("Alle velden zijn verplicht");
      return;
    }
  
    // Convert the form data to match DockingCyclus interface
    const apiPayload: DockingCyclus = {
      Id: 0, // Server will assign this
      DroneId: formData.DroneId,
      DockingId: formData.DockingId,
      CyclusId: formData.CyclusId
    } as DockingCyclus;
  
    // Log the payload for debugging
    console.log('Sending payload:', apiPayload);
  
    handleAddDockingCyclus(
      apiPayload,
      setIsLoading,
      setError,
      setIsOpen,
      setFormData
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Docking Cyclus
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nieuwe Docking Cyclus</DialogTitle>
          <DialogDescription>
            Voer de details in voor de nieuwe docking cyclus.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="DroneId" className="text-right">
                Drone ID
              </Label>
              <Input
                id="DroneId"
                type="number"
                min="0"
                value={formData.DroneId}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="DockingId" className="text-right">
                Docking ID
              </Label>
              <Input
                id="DockingId"
                type="number"
                min="0"
                value={formData.DockingId}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="CyclusId" className="text-right">
                Cyclus ID
              </Label>
              <Input
                id="CyclusId"
                type="number"
                min="0"
                value={formData.CyclusId}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-500 mb-4">{error}</p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Toevoegen..." : "Docking Cyclus Toevoegen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}