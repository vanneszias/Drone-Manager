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

import useVluchtCyclus from "@/hooks/useVluchtCyclus";
import { VluchtCyclus } from "@/app/types"; // Import base type if needed

// Use snake_case keys for form state to match API expectation eventually
type VluchtCyclusFormData = {
  verslag_id: number | string | undefined; // Use string for input, convert later
  plaats_id: number | string | undefined;
  drone_id: number | string | undefined;
  zone_id: number | string | undefined;
};

// Type for data sent to API
type VluchtCyclusApiInput = {
  verslag_id?: number | null;
  plaats_id?: number | null;
  drone_id?: number | null;
  zone_id?: number | null;
};

export function AddVluchtCyclusDialog() {
  const { handleAddVluchtCyclus } = useVluchtCyclus;
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<VluchtCyclusFormData>>({
    // Use Partial for initial state
    verslag_id: "", // Initialize as empty string for inputs
    plaats_id: "",
    drone_id: "",
    zone_id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value, // Keep as string for input handling
    }));
  };

  const resetForm = () => {
    setFormData({
      verslag_id: "",
      plaats_id: "",
      drone_id: "",
      zone_id: "",
    });
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Convert string inputs to numbers or null for API
    const apiData: VluchtCyclusApiInput = {
      verslag_id: formData.verslag_id
        ? parseInt(formData.verslag_id.toString(), 10) || null
        : null,
      plaats_id: formData.plaats_id
        ? parseInt(formData.plaats_id.toString(), 10) || null
        : null,
      drone_id: formData.drone_id
        ? parseInt(formData.drone_id.toString(), 10) || null
        : null,
      zone_id: formData.zone_id
        ? parseInt(formData.zone_id.toString(), 10) || null
        : null,
    };

    // Simple validation: ensure IDs are valid numbers if provided
    for (const key in apiData) {
      const value = apiData[key as keyof typeof apiData];
      if (value !== null && isNaN(value!)) {
        setError(`Invalid number provided for ${key.replace("_id", " ID")}.`);
        return;
      }
      if (value !== null && value! <= 0) {
        // IDs should be positive
        setError(`${key.replace("_id", " ID")} must be a positive number.`);
        return;
      }
    }

    // At least one ID should be provided for a meaningful record
    if (
      !apiData.verslag_id &&
      !apiData.plaats_id &&
      !apiData.drone_id &&
      !apiData.zone_id
    ) {
      setError(
        "Please provide at least one ID (Verslag, Plaats, Drone, or Zone)."
      );
      return;
    }

    handleAddVluchtCyclus(
      apiData as VluchtCyclus, // Send the processed data
      setIsLoading,
      setError,
      setIsOpen,
      resetForm // Pass the reset function
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
            Vul de details in voor de nieuwe vluchtcyclus. Minstens één ID is
            vereist.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="verslag_id" className="text-right">
                Verslag ID
              </Label>
              <Input
                id="verslag_id" // Use snake_case ID
                type="number"
                min="1" // IDs usually start from 1
                value={formData.verslag_id ?? ""}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Optional"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plaats_id" className="text-right">
                Plaats ID
              </Label>
              <Input
                id="plaats_id"
                type="number"
                min="1"
                value={formData.plaats_id ?? ""}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Optional"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="drone_id" className="text-right">
                Drone ID
              </Label>
              <Input
                id="drone_id"
                type="number"
                min="1"
                value={formData.drone_id ?? ""}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Optional"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="zone_id" className="text-right">
                Zone ID
              </Label>
              <Input
                id="zone_id"
                type="number"
                min="1" // Changed min to 1
                value={formData.zone_id ?? ""} // Handle null/undefined for input value
                onChange={handleInputChange} // Keep existing onChange
                className="col-span-3"
                placeholder="Optional"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Annuleren
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Opslaan..." : "Vluchtcyclus Opslaan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
