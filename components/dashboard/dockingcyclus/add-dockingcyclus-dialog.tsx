"use client";

import React, { useState, useEffect } from 'react';
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DockingCyclus, Drone, Docking, Cyclus } from '@/app/types';
import { PlusCircle } from 'lucide-react';
import useDockingCyclus from '@/hooks/useDockingCyclus';
import useDrones from '@/hooks/useDrones';
import useDockings from '@/hooks/useDockings';
import useCyclus from '@/hooks/useCyclus';

type DockingCyclusFormData = {
  DroneId: number;
  DockingId: number;
  CyclusId: number;
};

export function AddDockingCyclusDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<DockingCyclusFormData>({
    DroneId: 0,
    DockingId: 0,
    CyclusId: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [dockings, setDockings] = useState<Docking[]>([]);
  const [cycli, setCycli] = useState<Cyclus[]>([]);
  const [dronesLoading, setDronesLoading] = useState(false);
  const [dockingsLoading, setDockingsLoading] = useState(false);
  const [cycliLoading, setCycliLoading] = useState(false);
  const { handleAddDockingCyclus } = useDockingCyclus;
  const { getDrones } = useDrones;
  const { getDockings } = useDockings;
  const { getCycli } = useCyclus;

  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          setDronesLoading(true);
          setDockingsLoading(true);
          setCycliLoading(true);

          const [dronesData, dockingsData, cycliData] = await Promise.all([
            getDrones(),
            getDockings(),
            getCycli()
          ]);

          setDrones(dronesData);
          setDockings(dockingsData);
          setCycli(cycliData);
        } catch (error) {
          console.error("Failed to load data:", error);
          setError(error instanceof Error ? error.message : "Failed to load data");
        } finally {
          setDronesLoading(false);
          setDockingsLoading(false);
          setCycliLoading(false);
        }
      };
      loadData();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddDockingCyclus(
      formData as DockingCyclus,
      setIsLoading,
      setError,
      setIsOpen,
      setFormData
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Docking Cyclus
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nieuwe Docking Cyclus</DialogTitle>
          <DialogDescription>
            Voer de details in voor de nieuwe docking cyclus.
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
                  onValueChange={(value) => setFormData(prev => ({ ...prev, DroneId: parseInt(value) }))}
                  disabled={dronesLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecteer een drone" />
                  </SelectTrigger>
                  <SelectContent>
                    {dronesLoading ? (
                      <SelectItem value="" disabled>
                        Drones laden...
                      </SelectItem>
                    ) : drones.length > 0 ? (
                      drones.map((drone) => (
                        <SelectItem key={drone.Id} value={drone.Id.toString()}>
                          {`Drone ${drone.Id} (${drone.status}, ${drone.batterij}%)`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        Geen drones beschikbaar
                      </SelectItem>
                    )}
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
                  onValueChange={(value) => setFormData(prev => ({ ...prev, DockingId: parseInt(value) }))}
                  disabled={dockingsLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecteer een docking" />
                  </SelectTrigger>
                  <SelectContent>
                    {dockingsLoading ? (
                      <SelectItem value="" disabled>
                        Dockings laden...
                      </SelectItem>
                    ) : dockings.length > 0 ? (
                      dockings.map((docking) => (
                        <SelectItem key={docking.Id} value={docking.Id.toString()}>
                          {`${docking.locatie} (${docking.isbeschikbaar ? "Beschikbaar" : "Niet Beschikbaar"})`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        Geen dockings beschikbaar
                      </SelectItem>
                    )}
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
                  onValueChange={(value) => setFormData(prev => ({ ...prev, CyclusId: parseInt(value) }))}
                  disabled={cycliLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecteer een cyclus" />
                  </SelectTrigger>
                  <SelectContent>
                    {cycliLoading ? (
                      <SelectItem value="" disabled>
                        Cycli laden...
                      </SelectItem>
                    ) : cycli.length > 0 ? (
                      cycli.map((cyclus) => (
                        <SelectItem key={cyclus.Id} value={cyclus.Id.toString()}>
                          {`Cyclus ${cyclus.Id}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        Geen cycli beschikbaar
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-500 mb-4">{error}</p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Toevoegen..." : "Docking Cyclus Toevoegen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}