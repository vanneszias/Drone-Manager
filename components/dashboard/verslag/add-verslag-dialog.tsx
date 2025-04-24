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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import useVerslag from "@/hooks/useVerslag";
import useVluchtCyclus from "@/hooks/useVluchtCyclus";
import { Verslag, VluchtCyclus } from "@/app/types";

interface VerslagInput {
  onderwerp: string;
  inhoud: string;
  vlucht_cyclus_id?: number | null;
}

export function AddVerslagDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<VerslagInput>({
    onderwerp: "",
    inhoud: "",
    vlucht_cyclus_id: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vluchtCycli, setVluchtCycli] = useState<VluchtCyclus[]>([]);
  const { getVluchtCycli } = useVluchtCyclus;

  useEffect(() => {
    const fetchVluchtCycli = async () => {
      if (isOpen) {
        try {
          const data = await getVluchtCycli();
          setVluchtCycli(data);
        } catch (error) {
          console.error("Error fetching vluchtcycli:", error);
          setError("Failed to load vlucht cycli");
        }
      }
    };

    fetchVluchtCycli();
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleVluchtCyclusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      vlucht_cyclus_id: value ? parseInt(value) : null,
    }));
  };

  const resetForm = () => {
    setFormData({ onderwerp: "", inhoud: "", vlucht_cyclus_id: null });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await useVerslag.handleAddVerslag(
      formData as Verslag,
      setIsLoading,
      setError,
      setIsOpen,
      resetForm
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Verslag
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Verslag</DialogTitle>
          <DialogDescription>
            Fill in the details for the new verslag.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-4 px-1">{error}</p>}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="onderwerp" className="text-right">
                Subject
              </Label>
              <Input
                id="onderwerp"
                value={formData.onderwerp}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="inhoud" className="text-right">
                Content
              </Label>
              <Textarea
                id="inhoud"
                value={formData.inhoud}
                onChange={handleInputChange}
                className="col-span-3 min-h-[100px]"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vlucht_cyclus_select" className="text-right">
                Flight Cycle <span className="text-xs text-muted-foreground">(Optional)</span>
              </Label>
              <Select
                value={formData.vlucht_cyclus_id?.toString() || ""}
                onValueChange={handleVluchtCyclusChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a flight cycle" />
                </SelectTrigger>
                <SelectContent>
                  {vluchtCycli.map((vluchtCyclus) => (
                    <SelectItem key={vluchtCyclus.Id} value={vluchtCyclus.Id.toString()}>
                      {`Flight Cycle ${vluchtCyclus.Id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Verslag"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
