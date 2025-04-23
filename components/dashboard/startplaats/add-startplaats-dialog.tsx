"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import useStartplaats from '@/hooks/useStartplaats';

interface StartplaatsFormData {
  id: number,
  naam: string;
  locatie: string;
  isBeschikbaar: boolean;
}

export function AddStartplaatsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<StartplaatsFormData>({
    id: 0,
    naam: '',
    locatie: '',
    isBeschikbaar: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    useStartplaats.handleAddStartplaats(
      formData,
      setIsLoading,
      setError,
      setIsOpen,
      setFormData,
    )
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Startplaats</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Startplaats</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="naam">Naam</Label>
              <Input id="naam" value={formData.naam} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="locatie">Locatie</Label>
              <Input id="locatie" value={formData.locatie} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="isBeschikbaar">Beschikbaar</Label>
              <input
                type="checkbox"
                id="isBeschikbaar"
                checked={formData.isBeschikbaar}
                onChange={(e) => setFormData((prev) => ({ ...prev, isBeschikbaar: e.target.checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}