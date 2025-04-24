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
import { Cyclus, VluchtCyclus } from "@/app/types";
import { PlusCircle } from "lucide-react";
import useCyclus from "@/hooks/useCyclus";
import useVluchtCyclus from "@/hooks/useVluchtCyclus";

type CyclusFormData = {
  startuur: string;
  tijdstip: string;
  VluchtCyclusId?: number | null;
};

export function AddCyclusDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CyclusFormData>({
    startuur: "",
    tijdstip: "",
    VluchtCyclusId: null,
  });
  const [vluchtCycli, setVluchtCycli] = useState<VluchtCyclus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleAddCyclus } = useCyclus;
  const { getVluchtCycli } = useVluchtCyclus;

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
      VluchtCyclusId: value ? parseInt(value) : null,
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
              <Label htmlFor="tijdsduur" className="text-right">
                Tijdsduur
              </Label>
              <Input
                id="tijdsduur"
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
                value={formData.VluchtCyclusId?.toString() || ""}
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
              {isLoading ? "Toevoegen..." : "Cyclus Toevoegen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
