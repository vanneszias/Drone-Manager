"use client";

import React, { useEffect, useState } from "react";
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
import { Drone, Startplaats, Zone } from "@/app/types";
import useVluchtCyclus from "@/hooks/useVluchtCyclus";

type Step = "DRONE" | "LOCATION" | "ZONE";

export function AddVluchtCyclusDialog() {
  const { handleCreateVluchtCyclus, getDrones, getPlaces, getZones } =
    useVluchtCyclus;

  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("DRONE");
  const [formData, setFormData] = useState({
    droneId: "",
    plaatsId: "",
    zoneId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [places, setPlaces] = useState<Startplaats[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!isOpen) return;

      try {
        if (currentStep === "DRONE") {
          const dronesData = await getDrones();
          // Filter only available drones that can take off
          setDrones(
            dronesData.filter(
              (d: Drone) => d.status === "AVAILABLE" && d.magOpstijgen
            )
          );
        } else if (currentStep === "LOCATION") {
          const placesData = await getPlaces();
          // Filter only available locations
          setPlaces(placesData.filter((p: Startplaats) => p.isbeschikbaar));
        } else if (currentStep === "ZONE") {
          const zonesData = await getZones();
          setZones(zonesData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load options");
      }
    };

    loadData();
  }, [currentStep, isOpen]);

  const resetForm = () => {
    setFormData({
      droneId: "",
      plaatsId: "",
      zoneId: "",
    });
    setCurrentStep("DRONE");
    setError(null);
  };

  const handleSelectChange = (value: string, field: keyof typeof formData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep === "DRONE") {
      setCurrentStep("LOCATION");
    } else if (currentStep === "LOCATION") {
      setCurrentStep("ZONE");
    }
  };

  const handleBack = () => {
    if (currentStep === "LOCATION") {
      setCurrentStep("DRONE");
    } else if (currentStep === "ZONE") {
      setCurrentStep("LOCATION");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const droneId = parseInt(formData.droneId);
    const plaatsId = parseInt(formData.plaatsId);
    const zoneId = formData.zoneId ? parseInt(formData.zoneId) : null;

    if (!droneId || !plaatsId) {
      setError("Drone and location are required");
      return;
    }

    handleCreateVluchtCyclus(
      droneId,
      plaatsId,
      zoneId,
      setIsLoading,
      setError,
      setIsOpen,
      resetForm
    );
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "DRONE":
        return "Selecteer een Drone";
      case "LOCATION":
        return "Selecteer een Startlocatie";
      case "ZONE":
        return "Selecteer een Zone (Optioneel)";
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
          <DialogTitle>{getStepTitle()}</DialogTitle>
          <DialogDescription>
            {currentStep === "DRONE" &&
              "Kies een beschikbare drone om te vliegen."}
            {currentStep === "LOCATION" && "Kies een beschikbare startlocatie."}
            {currentStep === "ZONE" &&
              "Optioneel: kies een zone voor deze vlucht."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {currentStep === "DRONE" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="drone_select" className="text-right">
                  Drone
                </Label>
                <Select
                  value={formData.droneId}
                  onValueChange={(value) =>
                    handleSelectChange(value, "droneId")
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecteer een drone" />
                  </SelectTrigger>
                  <SelectContent>
                    {drones.map((drone) => (
                      <SelectItem key={drone.Id} value={drone.Id.toString()}>
                        {`Drone ${drone.Id} (${drone.batterij}% batterij)`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {currentStep === "LOCATION" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="plaats_select" className="text-right">
                  Startplaats
                </Label>
                <Select
                  value={formData.plaatsId}
                  onValueChange={(value) =>
                    handleSelectChange(value, "plaatsId")
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecteer een startplaats" />
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
            )}

            {currentStep === "ZONE" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="zone_select" className="text-right">
                  Zone
                </Label>
                <Select
                  value={formData.zoneId}
                  onValueChange={(value) => handleSelectChange(value, "zoneId")}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecteer een zone (optioneel)" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((zone) => (
                      <SelectItem key={zone.Id} value={zone.Id.toString()}>
                        {`${zone.naam} (${zone.breedte}x${zone.lengte}m)`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
            {currentStep !== "DRONE" && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="mr-2"
              >
                Terug
              </Button>
            )}
            {currentStep === "ZONE" ? (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Opslaan..." : "Vluchtcyclus Opslaan"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                disabled={
                  (currentStep === "DRONE" && !formData.droneId) ||
                  (currentStep === "LOCATION" && !formData.plaatsId)
                }
              >
                Volgende
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
