"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DockingCyclus, Drone, Docking, Cyclus } from "@/app/types";
import useDockingCyclus from "@/hooks/useDockingCyclus";
import useDrones from "@/hooks/useDrones";
import useDockings from "@/hooks/useDockings";
import useCyclus from "@/hooks/useCyclus";

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
  const { handleUpdateDockingCyclus } = useDockingCyclus;
  const { getDrones } = useDrones;
  const { getDockings } = useDockings;
  const { getCycli } = useCyclus;

  const [formData, setFormData] = useState<DockingCyclus>(dockingCyclus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [dockings, setDockings] = useState<Docking[]>([]);
  const [cycli, setCycli] = useState<Cyclus[]>([]);

  // Update form data when dockingCyclus prop changes
  useEffect(() => {
    setFormData(dockingCyclus);
  }, [dockingCyclus]);

  // Load related data when dialog opens
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          const [dronesData, dockingsData, cycliData] = await Promise.all([
            getDrones(),
            getDockings(),
            getCycli(),
          ]);
          setDrones(dronesData);
          setDockings(dockingsData);
          setCycli(cycliData);
        } catch (error) {
          console.error("Failed to load data:", error);
          setError(error instanceof Error ? error.message : "Failed to load data");
        }
      };
      loadData();
    }
  }, [isOpen]);

  const handleSelectChange = (value: string, field: keyof DockingCyclus) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseInt(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.DroneId || !formData.DockingId || !formData.CyclusId) {
      setError("All fields are required");
      return;
    }

    handleUpdateDockingCyclus(
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
          <DialogTitle>Edit Docking Cyclus</DialogTitle>
          <DialogDescription>
            Update the docking cyclus details. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="DroneId" className="text-right">
                Drone
              </Label>
              <div className="col-span-3">
                <Select 
                  value={formData.DroneId ? formData.DroneId.toString() : ""}
                  onValueChange={(value) => handleSelectChange(value, "DroneId")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Drone" />
                  </SelectTrigger>
                  <SelectContent>
                    {drones.map((drone) => (
                      <SelectItem key={drone.Id} value={drone.Id.toString()}>
                        {`Drone ${drone.Id} (${drone.status})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="DockingId" className="text-right">
                Docking
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.DockingId ? formData.DockingId.toString() : ""}
                  onValueChange={(value) => handleSelectChange(value, "DockingId")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Docking" />
                  </SelectTrigger>
                  <SelectContent>
                    {dockings.map((docking) => (
                      <SelectItem key={docking.Id} value={docking.Id.toString()}>
                        {`${docking.locatie} (${docking.isbeschikbaar ? "Available" : "Not Available"})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="CyclusId" className="text-right">
                Cyclus
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.CyclusId ? formData.CyclusId.toString() : ""}
                  onValueChange={(value) => handleSelectChange(value, "CyclusId")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Cyclus" />
                  </SelectTrigger>
                  <SelectContent>
                    {cycli.map((cyclus) => (
                      <SelectItem key={cyclus.Id} value={cyclus.Id.toString()}>
                        {`Cyclus ${cyclus.Id} (${cyclus.startuur})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
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
