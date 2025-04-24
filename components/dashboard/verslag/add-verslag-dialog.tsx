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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import useVerslag from "@/hooks/useVerslag";
import useVluchtCyclus from "@/hooks/useVluchtCyclus";
import { Verslag, VluchtCyclus } from "@/app/types";

interface VerslagInput {
  onderwerp: string;
  inhoud: string;
  isverzonden?: boolean;
  isgeaccepteerd?: boolean;
  VluchtCyclusId?: number | null;
}

export function AddVerslagDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<VerslagInput>({
    onderwerp: "",
    inhoud: "",
    isverzonden: false,
    isgeaccepteerd: false,
    VluchtCyclusId: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vluchtCycli, setVluchtCycli] = useState<VluchtCyclus[]>([]);
  const { handleAddVerslag } = useVerslag;
  const { getVluchtCycli } = useVluchtCyclus;

  useEffect(() => {
    if (isOpen) {
      const loadVluchtCycli = async () => {
        try {
          const data = await getVluchtCycli();
          setVluchtCycli(data);
        } catch (error) {
          console.error("Error loading vluchtcycli:", error);
        }
      };
      loadVluchtCycli();
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleVluchtCyclusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      VluchtCyclusId: value ? parseInt(value) : null,
    }));
  };

  const resetForm = () => {
    setFormData({
      onderwerp: "",
      inhoud: "",
      isverzonden: false,
      isgeaccepteerd: false,
      VluchtCyclusId: null,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAddVerslag(
      formData as Verslag,
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
              <Label htmlFor="isverzonden" className="text-right">
                Is Sent
              </Label>
              <input
                id="isverzonden"
                type="checkbox"
                checked={formData.isverzonden}
                onChange={handleInputChange}
                className="col-span-3 h-4 w-4"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isgeaccepteerd" className="text-right">
                Is Accepted
              </Label>
              <input
                id="isgeaccepteerd"
                type="checkbox"
                checked={formData.isgeaccepteerd}
                onChange={handleInputChange}
                className="col-span-3 h-4 w-4"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="VluchtCyclusId" className="text-right">
                Flight Cycle
              </Label>
              <Select
                value={formData.VluchtCyclusId?.toString() || ""}
                onValueChange={handleVluchtCyclusChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select Flight Cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {vluchtCycli.map((vc) => (
                    <SelectItem key={vc.Id} value={vc.Id.toString()}>
                      Flight Cycle {vc.Id}
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
              onClick={() => setIsOpen(false)}
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
