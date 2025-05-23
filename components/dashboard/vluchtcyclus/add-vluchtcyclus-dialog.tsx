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
import { VluchtCyclus, Startplaats, Drone, Zone, Verslag } from "@/app/types";

export function AddVluchtCyclusDialog() {
  const {
    handleAddVluchtCyclus,
    getPlaces,
    getDrones,
    getZones,
    getVerslagen,
  } = useVluchtCyclus;
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<VluchtCyclus>({
    VerslagId: null,
    PlaatsId: null,
    DroneId: null,
    ZoneId: null,
  } as VluchtCyclus);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [places, setPlaces] = useState<Startplaats[]>([]);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [verslagen, setVerslagen] = useState<Verslag[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [placesData, dronesData, zonesData, verslagenData] =
          await Promise.all([
            getPlaces(),
            getDrones(),
            getZones(),
            getVerslagen(),
          ]);
        setPlaces(placesData);
        setDrones(dronesData);
        setZones(zonesData);
        setVerslagen(verslagenData);
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
      [field]: value === "" ? null : parseInt(value),
    }));
  };

  const resetForm = () => {
    setFormData({
      VerslagId: null,
      PlaatsId: null,
      DroneId: null,
      ZoneId: null,
    } as VluchtCyclus);

    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate and ensure all values are proper numbers or null
      const apiData = {
        VerslagId: formData.VerslagId || null,
        PlaatsId: formData.PlaatsId || null,
        DroneId: formData.DroneId || null,
        ZoneId: formData.ZoneId || null,
      };

      // Check if at least one required field is filled
      if (!apiData.PlaatsId && !apiData.DroneId && !apiData.ZoneId) {
        setError("Please select at least one option (Place, Drone, or Zone)");
        return;
      }

      // Check if the selected drone is available
      if (apiData.DroneId) {
        const selectedDrone = drones.find((d) => d.Id === apiData.DroneId);
        if (selectedDrone?.status !== "AVAILABLE") {
          setError("Selected drone is not available");
          return;
        }
      }

      handleAddVluchtCyclus(
        apiData as VluchtCyclus,
        setIsLoading,
        setError,
        setIsOpen,
        resetForm
      );
    } catch (error) {
      console.error("Error preparing form data:", error);
      setError("Invalid form data. Please check your selections.");
    }
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
              <Label htmlFor="verslag_select" className="text-right">
                Verslag
              </Label>
              <Select
                value={formData.VerslagId?.toString() || ""}
                onValueChange={(value) =>
                  handleSelectChange(value, "VerslagId")
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecteer een verslag" />
                </SelectTrigger>
                <SelectContent>
                  {verslagen.map((verslag) => (
                    <SelectItem key={verslag.Id} value={verslag.Id.toString()}>
                      {verslag.onderwerp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              {isLoading ? "Opslaan..." : "Vluchtcyclus Opslaan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
