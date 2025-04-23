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
import { VluchtCyclus } from '@/app/types';
import { PlusCircle } from 'lucide-react';
import useVluchtCyclus from '@/hooks/useVluchtCyclus';

type VluchtCyclusFormData = {
  VerslagId: number;
  PlaatsId: number;
  DroneId: number;
  ZoneId: number;
};

export function AddVluchtCyclusDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<VluchtCyclusFormData>({
    VerslagId: 0,
    PlaatsId: 0,
    DroneId: 0,
    ZoneId: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleAddVluchtCyclus } = useVluchtCyclus;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: parseInt(value) || 0,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddVluchtCyclus(
      formData as VluchtCyclus, 
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
          <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Vluchtcyclus
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nieuwe Vluchtcyclus Toevoegen</DialogTitle>
          <DialogDescription>
            Vul de details in voor de nieuwe vluchtcyclus.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="VerslagId" className="text-right">
                Verslag ID
              </Label>
              <Input
                id="VerslagId"
                type="number"
                min="0"
                value={formData.VerslagId}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="PlaatsId" className="text-right">
                Plaats ID
              </Label>
              <Input
                id="PlaatsId"
                type="number"
                min="0"
                value={formData.PlaatsId}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
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
              <Label htmlFor="ZoneId" className="text-right">
                Zone ID
              </Label>
              <Input
                id="ZoneId"
                type="number"
                min="0"
                value={formData.ZoneId}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Opslaan...' : 'Vluchtcyclus Opslaan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}