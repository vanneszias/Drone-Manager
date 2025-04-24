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
import { Zone } from "@/app/types";
import useZones from "@/hooks/useZones";

interface EditZoneDialogProps {
  zone: Zone;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function EditZoneDialog({
  zone,
  isOpen,
  setIsOpen,
}: EditZoneDialogProps) {
  const [formData, setFormData] = useState<Zone>(zone);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(zone);
  }, [zone]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.naam) {
      setError("Zone name is required.");
      return;
    }
    if (isNaN(formData.breedte) || formData.breedte <= 0) {
      setError("Please enter a valid positive number for Width.");
      return;
    }
    if (isNaN(formData.lengte) || formData.lengte <= 0) {
      setError("Please enter a valid positive number for Length.");
      return;
    }
    if (isNaN(formData.EvenementId) || formData.EvenementId <= 0) {
      setError("Please enter a valid Event ID.");
      return;
    }

    useZones.handleUpdateZone(
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
          <DialogTitle>Edit Zone</DialogTitle>
          <DialogDescription>
            Make changes to the zone. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="naam" className="text-right">
                Name
              </Label>
              <Input
                id="naam"
                value={formData.naam}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            {/* Width */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="breedte" className="text-right">
                Width
              </Label>
              <Input
                id="breedte"
                type="number"
                value={formData.breedte}
                onChange={handleInputChange}
                className="col-span-3"
                required
                step="any"
                min="0.01"
              />
            </div>
            {/* Length */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lengte" className="text-right">
                Length
              </Label>
              <Input
                id="lengte"
                type="number"
                value={formData.lengte}
                onChange={handleInputChange}
                className="col-span-3"
                required
                step="any"
                min="0.01"
              />
            </div>
            {/* Event ID */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="EvenementId" className="text-right">
                Event ID
              </Label>
              <Input
                id="EvenementId"
                type="number"
                value={formData.EvenementId}
                onChange={handleInputChange}
                className="col-span-3"
                required
                min="1"
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
