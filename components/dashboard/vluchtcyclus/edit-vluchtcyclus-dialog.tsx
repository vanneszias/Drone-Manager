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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { VluchtCyclus, Startplaats, Drone, Zone } from "@/app/types";
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
  const { handleUpdateVluchtCyclus, getPlaces, getDrones, getZones } =
    useVluchtCyclus;
  const [formData, setFormData] = useState<VluchtCyclus>(vluchtCyclus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [places, setPlaces] = useState<Startplaats[]>([]);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    setFormData(vluchtCyclus);
  }, [vluchtCyclus]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [placesData, dronesData, zonesData] = await Promise.all([
          getPlaces(),
          getDrones(),
          getZones(),
        ]);
        setPlaces(placesData);
        setDrones(dronesData);
        setZones(zonesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load options");
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleSelectChange = (value: string, field: keyof VluchtCyclus) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value ? parseInt(value) : null,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.PlaatsId && !formData.DroneId && !formData.ZoneId) {
      setError("Minstens één optie (Plaats, Drone, of Zone) is vereist");
      return;
    }

    handleUpdateVluchtCyclus(
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
          <DialogTitle>Bewerk Vluchtcyclus</DialogTitle>
          <DialogDescription>
            Pas de details van de vluchtcyclus aan. Minstens één optie is
            vereist.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plaats_select" className="text-right">
                Plaats
              </Label>
              <Select
                value={formData.PlaatsId?.toString() || ""}
                onValueChange={(value) => handleSelectChange(value, "PlaatsId")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecteer een plaats" />
                </SelectTrigger>
                <SelectContent>
                  {places.map((place) => (
                    <SelectItem key={place.Id} value={place.Id.toString()}>
                      {place.locatie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="drone_select" className="text-right">
                Drone
              </Label>
              <Select
                value={formData.DroneId?.toString() || ""}
                onValueChange={(value) => handleSelectChange(value, "DroneId")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecteer een drone" />
                </SelectTrigger>
                <SelectContent>
                  {drones.map((drone) => (
                    <SelectItem key={drone.Id} value={drone.Id.toString()}>
                      {`Drone ${drone.Id} - ${drone.status}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="zone_select" className="text-right">
                Zone
              </Label>
              <Select
                value={formData.ZoneId?.toString() || ""}
                onValueChange={(value) => handleSelectChange(value, "ZoneId")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecteer een zone" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.Id} value={zone.Id.toString()}>
                      {zone.naam}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Annuleren
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Opslaan..." : "Wijzigingen Opslaan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
