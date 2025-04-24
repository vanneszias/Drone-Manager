"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Startplaats } from "@/app/types";
import useStartplaats from "@/hooks/useStartplaats";

interface EditStartplaatsDialogProps {
  startplaats: Startplaats;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function EditStartplaatsDialog({
  startplaats,
  isOpen,
  setIsOpen,
}: EditStartplaatsDialogProps) {
  const [formData, setFormData] = useState<Startplaats>(startplaats);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(startplaats);
  }, [startplaats]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.locatie.trim()) {
      setError("Location is required");
      return;
    }

    useStartplaats.handleUpdateStartplaats(
      formData,
      setIsLoading,
      setError,
      setIsOpen,
      setFormData
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Start Plaats</DialogTitle>
          <DialogDescription>
            Make changes to the starting place. Click save when you're done.
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
                value={formData.locatie}
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
                checked={formData.isbeschikbaar}
                onChange={handleInputChange}
                className="col-span-3 h-4 w-4 justify-self-start"
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
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
