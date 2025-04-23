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
import useDockings from "@/hooks/useDockings";

// Matches the data structure expected by the API
type DockingFormData = {
  locatie: string;
  isbeschikbaar: boolean;
};

export function AddDockingDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<DockingFormData>>({
    locatie: "",
    isbeschikbaar: true, // Default to available
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      isbeschikbaar: e.target.checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    useDockings.handleAddDocking(
      formData as DockingFormData, // Cast to full type, ensure validation covers missing fields
      setIsLoading,
      setError,
      setIsOpen,
      (resetData) => setFormData(resetData as DockingFormData) // Use cast for reset function
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Docking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Docking</DialogTitle>
          <DialogDescription>
            Enter the details for the new docking. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locatie" className="text-right">
                Location
              </Label>
              <Input
                id="locatie"
                value={formData.locatie || ""}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isbeschikbaar" className="text-right">
                Available
              </Label>
              <input
                id="isbeschikbaar"
                type="checkbox"
                checked={formData.isbeschikbaar ?? true}
                onChange={handleCheckboxChange}
                className="col-span-3 h-4 w-4 justify-self-start"
              />
              {/* Consider using Shadcn Checkbox for consistency */}
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Docking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}