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
import { VluchtCyclus } from "@/app/types";
import useVluchtCyclus from "@/hooks/useVluchtCyclus";

interface EditVluchtCyclusDialogProps {
  vluchtCyclus: VluchtCyclus;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function EditVluchtCyclusDialog({
  vluchtCyclus,
  isOpen,
  setIsOpen,
}: EditVluchtCyclusDialogProps) {
  const [formData, setFormData] = useState<VluchtCyclus>(vluchtCyclus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(vluchtCyclus);
  }, [vluchtCyclus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value ? Number(value) : null,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // At least one ID is required
    if (
      !formData.VerslagId ||
      !formData.PlaatsId ||
      !formData.DroneId ||
      !formData.ZoneId
    ) {
      setError("At least one ID (Report, Place, Drone, or Zone) is required");
      return;
    }

    useVluchtCyclus.handleUpdateVluchtCyclus(
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
          <DialogTitle>Edit Flight Cycle</DialogTitle>
          <DialogDescription>
            Make changes to the flight cycle. At least one ID is required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="verslag_id" className="text-right">
                Report ID
              </Label>
              <Input
                id="verslag_id"
                type="number"
                min="1"
                value={formData.VerslagId || ""}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Optional"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plaats_id" className="text-right">
                Place ID
              </Label>
              <Input
                id="plaats_id"
                type="number"
                min="1"
                value={formData.PlaatsId || ""}
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
                value={formData.DroneId || ""}
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
                min="1"
                value={formData.ZoneId || ""}
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
