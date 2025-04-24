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
import { Event } from "@/app/types";
import useEvents from "@/hooks/useEvents";

interface EditEventDialogProps {
  event: Event;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function EditEventDialog({
  event,
  isOpen,
  setIsOpen,
}: EditEventDialogProps) {
  const [formData, setFormData] = useState<Event>(event);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(event);
  }, [event]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate dates
    const startDate = new Date(formData.StartDatum);
    const endDate = new Date(formData.EindDatum);

    if (isNaN(startDate.getTime())) {
      setError("Please enter a valid start date");
      return;
    }
    if (isNaN(endDate.getTime())) {
      setError("Please enter a valid end date");
      return;
    }
    if (endDate < startDate) {
      setError("End date cannot be before start date");
      return;
    }

    if (!formData.Naam.trim()) {
      setError("Name is required");
      return;
    }

    useEvents.handleUpdateEvent(
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
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Make changes to the event. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Naam" className="text-right">
                Name
              </Label>
              <Input
                id="Naam"
                value={formData.Naam}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="StartDatum" className="text-right">
                Start Date
              </Label>
              <Input
                id="StartDatum"
                type="date"
                value={formData.StartDatum}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="StartTijd" className="text-right">
                Start Time
              </Label>
              <Input
                id="StartTijd"
                type="time"
                step="1"
                value={formData.StartTijd}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="EindDatum" className="text-right">
                End Date
              </Label>
              <Input
                id="EindDatum"
                type="date"
                value={formData.EindDatum}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Tijdsduur" className="text-right">
                Duration
              </Label>
              <Input
                id="Tijdsduur"
                type="time"
                step="1"
                value={formData.Tijdsduur}
                onChange={handleInputChange}
                className="col-span-3"
                required
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
