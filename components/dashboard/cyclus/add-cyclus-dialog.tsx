"use client";

import { useState } from "react";
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
import { Cyclus } from "@/app/types";
import { PlusCircle } from "lucide-react";
import useCyclus from "@/hooks/useCyclus";

type CyclusFormData = {
  startuur: string;
  tijdstip: string;
  vluchtcyclusId?: number | null;
};

export function AddCyclusDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CyclusFormData>({
    startuur: "",
    tijdstip: "",
    vluchtcyclusId: null,
  } as CyclusFormData & Cyclus); // Ensure formData is of type CyclusFormData

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleAddCyclus } = useCyclus;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleAddCyclus(
      formData as Cyclus,
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
          <PlusCircle className="mr-2 h-4 w-4" />
          Nieuwe Cyclus
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nieuwe Cyclus Toevoegen</DialogTitle>
          <DialogDescription>
            Vul de details in voor de nieuwe cyclus.
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
                type="text"
                value={formData.tijdstip}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="HH:mm:ss"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vluchtcyclusId" className="text-right">
                Vluchtcyclus ID
              </Label>
              <Input
                id="vluchtcyclusId"
                type="number"
                min="0"
                value={formData.vluchtcyclusId || ""}
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
              Annuleren
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Toevoegen..." : "Cyclus Toevoegen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
