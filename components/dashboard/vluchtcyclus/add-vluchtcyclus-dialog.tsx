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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

import useVluchtCyclus from "@/hooks/useVluchtCyclus";
import { VluchtCyclus, Startplaats, Drone, Zone } from "@/app/types";

type VluchtCyclusFormData = {
  plaats_id: string;
  drone_id: string;
  zone_id: string;
};

export function AddVluchtCyclusDialog() {
  const { handleAddVluchtCyclus, getPlaces, getDrones, getZones } =
    useVluchtCyclus;
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<VluchtCyclusFormData>({
    plaats_id: "",
    drone_id: "",
    zone_id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [places, setPlaces] = useState<Startplaats[]>([]);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

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

  const handleSelectChange = (
    value: string,
    field: keyof VluchtCyclusFormData
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      plaats_id: "",
      drone_id: "",
      zone_id: "",
    });
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const apiData = {
      PlaatsId: formData.plaats_id ? parseInt(formData.plaats_id) : null,
      DroneId: formData.drone_id ? parseInt(formData.drone_id) : null,
      ZoneId: formData.zone_id ? parseInt(formData.zone_id) : null,
    };

    if (!apiData.PlaatsId && !apiData.DroneId && !apiData.ZoneId) {
      setError("Please select at least one option (Place, Drone, or Zone)");
      return;
    }

    handleAddVluchtCyclus(
      apiData as VluchtCyclus,
      setIsLoading,
      setError,
      setIsOpen,
      resetForm
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Vluchtcyclus
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nieuwe Vluchtcyclus Toevoegen</DialogTitle>
          <DialogDescription>
            Vul de details in voor de nieuwe vluchtcyclus. Minstens één optie is
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
                value={formData.plaats_id}
                onValueChange={(value) =>
                  handleSelectChange(value, "plaats_id")
                }
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
                value={formData.drone_id}
                onValueChange={(value) => handleSelectChange(value, "drone_id")}
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
                value={formData.zone_id}
                onValueChange={(value) => handleSelectChange(value, "zone_id")}
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
              {isLoading ? "Opslaan..." : "Vluchtcyclus Opslaan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
