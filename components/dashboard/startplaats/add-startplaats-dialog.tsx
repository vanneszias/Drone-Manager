"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddStartplaatsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ naam: '', locatie: '', isBeschikbaar: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('https://drone.ziasvannes.tech/api/startplaatsen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to add startplaats');
      alert('Startplaats added successfully!');
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error adding startplaats:', error);
      alert('An error occurred while adding the startplaats.');
    } finally {
      setIsLoading(false);
    }
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