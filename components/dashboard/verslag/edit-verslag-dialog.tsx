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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Verslag, VluchtCyclus } from "@/app/types";
import useVerslag from "@/hooks/useVerslag";
import useVluchtCyclus from "@/hooks/useVluchtCyclus";

interface EditVerslagDialogProps {
  verslag: Verslag;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function EditVerslagDialog({
  verslag,
  isOpen,
  setIsOpen,
}: EditVerslagDialogProps) {
  const [formData, setFormData] = useState<Verslag>(verslag);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vluchtCycli, setVluchtCycli] = useState<VluchtCyclus[]>([]);
  const { getVluchtCycli } = useVluchtCyclus;

  useEffect(() => {
    setFormData(verslag);
  }, [verslag]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.onderwerp?.trim()) {
      setError("Subject is required");
      return;
    }
    if (!formData.inhoud?.trim()) {
      setError("Content is required");
      return;
    }

    useVerslag.handleUpdateVerslag(
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
          <DialogTitle>Edit Report</DialogTitle>
          <DialogDescription>
            Make changes to the report. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="onderwerp" className="text-right">
                Subject
              </Label>
              <Input
                id="onderwerp"
                value={formData.onderwerp || ""}
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
                value={formData.inhoud || ""}
                onChange={handleInputChange}
                className="col-span-3"
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
                checked={formData.isverzonden || false}
                onChange={handleInputChange}
                className="col-span-3 h-4 w-4 justify-self-start"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isgeaccepteerd" className="text-right">
                Is Accepted
              </Label>
              <input
                id="isgeaccepteerd"
                type="checkbox"
                checked={formData.isgeaccepteerd || false}
                onChange={handleInputChange}
                className="col-span-3 h-4 w-4 justify-self-start"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vluchtcyclus_select" className="text-right">
                Flight Cycle
              </Label>
              <Select
                value={formData.VluchtCyclusId?.toString() || ""}
                onValueChange={handleVluchtCyclusChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a flight cycle" />
                </SelectTrigger>
                <SelectContent>
                  {vluchtCycli.map((vluchtCyclus) => (
                    <SelectItem key={vluchtCyclus.Id} value={vluchtCyclus.Id.toString()}>
                      {`Vluchtcyclus ${vluchtCyclus.Id}`}
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
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
