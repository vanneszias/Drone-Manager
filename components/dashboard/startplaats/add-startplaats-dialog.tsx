"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { PlusCircle } from "lucide-react"; // Import icon
import useStartplaats from '@/hooks/useStartplaats';

interface StartplaatsFormData {
  locatie: string;
  isbeschikbaar: boolean; // Match DB/API snake_case
}

export function AddStartplaatsDialog() {
  const { handleAddStartplaats } = useStartplaats; // Destructure the hook function
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<StartplaatsFormData>({
    locatie: '',
    isbeschikbaar: true // Default to true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      isbeschikbaar: e.target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleAddStartplaats(
      formData,
      setIsLoading,
      setError,
      setIsOpen, // Pass setIsOpen
      (resetData) => setFormData(resetData as StartplaatsFormData) // Pass reset callback
    )
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Startplaats
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Startplaats</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="locatie">Locatie</Label>
              <Input id="locatie" value={formData.locatie} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="isBeschikbaar">Beschikbaar</Label>
              <input
                type="checkbox"
                id="isBeschikbaar" // Use camelCase for state/ID mapping
                checked={formData.isbeschikbaar} // Use snake_case state field
                onChange={handleCheckboxChange}
              />
            </div>
            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
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