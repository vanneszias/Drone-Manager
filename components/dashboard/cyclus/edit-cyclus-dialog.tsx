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
import { Cyclus, VluchtCyclus } from "@/app/types";
import useCyclus from "@/hooks/useCyclus";
import useVluchtCyclus from "@/hooks/useVluchtCyclus";

interface EditCyclusDialogProps {
  cyclus: Cyclus;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function EditCyclusDialog({
  cyclus,
  isOpen,
  setIsOpen,
}: EditCyclusDialogProps) {
  const { handleUpdateCyclus } = useCyclus;
  const { getVluchtCycli } = useVluchtCyclus;
  const [formData, setFormData] = useState<Cyclus>({
    ...cyclus,
  });
  const [vluchtCycli, setVluchtCycli] = useState<VluchtCyclus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      ...cyclus,
    });
  }, [cyclus]);

  useEffect(() => {
    const fetchVluchtCycli = async () => {
      if (isOpen) {
        try {
          const data = await getVluchtCycli();
          setVluchtCycli(data);
        } catch (error) {
          console.error("Error fetching vluchtcycli:", error);
          setError("Failed to load vluchtcycli options");
        }
      }
    };

    fetchVluchtCycli();
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      vluchtcyclus_id: value ? parseInt(value) : null,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.startuur) {
      setError("Start hour is required");
      return;
    }
    if (!formData.tijdstip) {
      setError("Time duration is required");
      return;
    }

    handleUpdateCyclus(
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
          <DialogTitle>Bewerk Cyclus</DialogTitle>
          <DialogDescription>
            Pas de details van de cyclus aan.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startuur" className="text-right">
                Start Uur
              </Label>
              <Input
                id="startuur"
                type="time"
                value={formData.startuur}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tijdstip" className="text-right">
                Tijdstip
              </Label>
              <Input
                id="tijdstip"
                type="time"
                value={formData.tijdstip}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vluchtcyclus_select" className="text-right">
                Vluchtcyclus
              </Label>
              <Select
                value={formData.vluchtcyclus_id?.toString() || ""}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecteer een vluchtcyclus" />
                </SelectTrigger>
                <SelectContent>
                  {vluchtCycli.map((vc) => (
                    <SelectItem key={vc.Id} value={vc.Id.toString()}>
                      {`Vluchtcyclus ${vc.Id}`}
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
