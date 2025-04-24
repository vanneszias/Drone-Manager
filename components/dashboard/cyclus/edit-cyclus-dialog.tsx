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
import { Cyclus } from "@/app/types";
import useCyclus from "@/hooks/useCyclus";

interface EditCyclusDialogProps {
  cyclus: Cyclus;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function EditCyclusDialog({
  cyclus,
  isOpen,
  setIsOpen,
}: EditCyclusDialogProps) {
  const [formData, setFormData] = useState<Cyclus>(cyclus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(cyclus);
  }, [cyclus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "VluchtCyclusId" ? (value ? Number(value) : null) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.startuur) {
      setError("Start hour is required");
      return;
    }
    if (!formData.tijdstip) {
      setError("Time is required");
      return;
    }

    useCyclus.handleUpdateCyclus(
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
          <DialogTitle>Edit Cyclus</DialogTitle>
          <DialogDescription>
            Make changes to the cycle. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startuur" className="text-right">
                Start Uur
              </Label>
              <Input
                id="startuur"
                type="time"
                value={formData.startuur}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tijdsduur" className="text-right">
                Tijdsduur
              </Label>
              <Input
                id="tijdsduur"
                type="time"
                value={formData.tijdstip}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="VluchtCyclusId" className="text-right">
                Flight Cycle ID
              </Label>
              <Input
                id="VluchtCyclusId"
                type="number"
                min="1"
                value={formData.VluchtCyclusId || ""}
                onChange={handleInputChange}
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
