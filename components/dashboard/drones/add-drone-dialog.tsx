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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Drone } from "@/app/types";
import { PlusCircle } from "lucide-react";
import useDrones from "@/hooks/useDrones";

type DroneFormData = {
  status: Drone["status"];
  batterij: number;
  magOpstijgen: boolean;
};

type DroneApiInput = {
  status: Drone["status"];
  batterij: number;
  magOpstijgen: boolean;
};

export function AddDroneDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<DroneFormData>({
    status: "OFFLINE",
    magOpstijgen: false,
    batterij: 100,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const apiData: DroneApiInput = {
      status: formData.status,
      batterij: formData.batterij,
      magOpstijgen: formData.magOpstijgen,
    };
    useDrones.handleAddDrone(
      {
        ...apiData,
        Id: 0,
      },
      setIsLoading,
      setError,
      setIsOpen,
      () => setFormData({ status: "OFFLINE", batterij: 0, magOpstijgen: false })
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="button-primary">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Drone
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-effect border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl bg-clip-text text-transparent theme-gradient-2">
            Add New Drone
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Enter the details for the new drone below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right text-white/70">
                Status
              </Label>
              <Select
                onValueChange={handleSelectChange}
                defaultValue={formData.status}
              >
                <SelectTrigger className="col-span-3 glass-effect">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="glass-effect-strong">
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="IN_USE">In Use</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="OFFLINE">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="batterij" className="text-right text-white/70">
                Battery (%)
              </Label>
              <Input
                id="batterij"
                type="number"
                min="0"
                max="100"
                value={formData.batterij ?? ""}
                onChange={handleInputChange}
                className="col-span-3 input-base"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="magOpstijgen"
                className="text-right text-white/70"
              >
                Ready for Takeoff
              </Label>
              <div className="col-span-3 flex items-center">
                <input
                  id="magOpstijgen"
                  type="checkbox"
                  checked={formData.magOpstijgen || false}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 checked:bg-blue-500"
                />
              </div>
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-400 mb-4 bg-red-500/10 p-2 rounded-lg">
              {error}
            </p>
          )}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="button-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="button-primary"
            >
              {isLoading ? "Saving..." : "Save Drone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
