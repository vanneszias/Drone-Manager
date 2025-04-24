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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Drone } from "@/app/types";
import useDrones from "@/hooks/useDrones";

interface EditDroneDialogProps {
  drone: Drone;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function EditDroneDialog({
  drone,
  isOpen,
  setIsOpen,
}: EditDroneDialogProps) {
  const [formData, setFormData] = useState<Drone>(drone);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(drone);
  }, [drone]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSelectChange = (value: Drone["status"]) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate battery percentage
    if (formData.batterij < 0 || formData.batterij > 100) {
      setError("Battery percentage must be between 0 and 100");
      return;
    }

    useDrones.handleUpdateDrone(
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
          <DialogTitle>Edit Drone</DialogTitle>
          <DialogDescription>
            Make changes to the drone. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                onValueChange={handleSelectChange}
                defaultValue={formData.status}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="IN_USE">In Use</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="OFFLINE">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="batterij" className="text-right">
                Battery (%)
              </Label>
              <Input
                id="batterij"
                type="number"
                min="0"
                max="100"
                value={formData.batterij}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="magOpstijgen" className="text-right">
                Ready for Takeoff
              </Label>
              <input
                id="magOpstijgen"
                type="checkbox"
                checked={formData.magOpstijgen}
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
