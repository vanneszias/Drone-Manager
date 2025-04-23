"use client";

import { useState } from "react";
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
import { Verslag } from "@/app/types";
import { PlusCircle } from "lucide-react";

import useVerslag from "@/hooks/useVerslag";

export function AddVerslagDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Verslag>>({
    onderwerp: '',
    beschrijving: '',
    isverzonden: false,
    droneId: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const verslagData: Verslag = {
      id: 0,
      onderwerp: formData.onderwerp || '',
      beschrijving: formData.beschrijving || '',
      isverzonden: formData.isverzonden || false,
      droneId: formData.droneId || 0,
  };

  await useVerslag.handleAddVerslag(
    verslagData,
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
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Verslag
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Verslag</DialogTitle>
          <DialogDescription>
            Fill in the details for the new verslag.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="onderwerp" className="text-right">
                Onderwerp
              </Label>
              <Input
                id="onderwerp"
                value={formData.onderwerp}
                onChange={(e) => setFormData({ ...formData, onderwerp: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="beschrijving" className="text-right">
                Beschrijving
              </Label>
              <Input
                id="beschrijving"
                value={formData.beschrijving}
                onChange={(e) => setFormData({ ...formData, beschrijving: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="droneId" className="text-right">
                Drone ID
              </Label>
              <Input
                id="droneId"
                type="number"
                value={formData.droneId}
                onChange={(e) => setFormData({ ...formData, droneId: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Verslag"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}