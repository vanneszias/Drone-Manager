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
import { DockingCyclus } from "@/app/types";
import useDockingCyclus from "@/hooks/useDockingCyclus";

interface EditDockingCyclusDialogProps {
  dockingCyclus: DockingCyclus;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function EditDockingCyclusDialog({
  dockingCyclus,
  isOpen,
  setIsOpen,
}: EditDockingCyclusDialogProps) {
  const [formData, setFormData] = useState<DockingCyclus>(dockingCyclus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(dockingCyclus);
  }, [dockingCyclus]);

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

    // Both IDs are required
    if (!formData.DroneId || !formData.DockingId) {
      setError("Both Drone ID and Docking ID are required");
      return;
    }

    useDockingCyclus.handleUpdateDockingCyclus(
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
          <DialogTitle>Edit Docking Cycle</DialogTitle>
          <DialogDescription>
            Make changes to the docking cycle. Both Drone ID and Docking ID are
            required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="DroneId" className="text-right">
                Drone ID
              </Label>
              <Input
                id="DroneId"
                type="number"
                min="1"
                value={formData.DroneId || ""}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="DockingId" className="text-right">
                Docking ID
              </Label>
              <Input
                id="DockingId"
                type="number"
                min="1"
                value={formData.DockingId || ""}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="CyclusId" className="text-right">
                Cycle ID
              </Label>
              <Input
                id="CyclusId"
                type="number"
                min="1"
                value={formData.CyclusId || ""}
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
