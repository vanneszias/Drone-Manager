"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { VluchtCyclus, Verslag } from "@/app/types";
import useVluchtCyclus from "@/hooks/useVluchtCyclus";

interface AttachVerslagDialogProps {
  vluchtCyclus: VluchtCyclus;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function AttachVerslagDialog({
  vluchtCyclus,
  isOpen,
  setIsOpen,
}: AttachVerslagDialogProps) {
  const { getVerslagen, handleAttachVerslag } = useVluchtCyclus;
  const [verslagen, setVerslagen] = useState<Verslag[]>([]);
  const [selectedVerslagId, setSelectedVerslagId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadVerslagen = async () => {
      try {
        const data = await getVerslagen();
        // Filter out verslagen that are already attached to other vluchtcycli
        const availableVerslagen = data.filter(
          (v: Verslag) =>
            !v.VluchtCyclusId || v.VluchtCyclusId === vluchtCyclus.Id
        );
        setVerslagen(availableVerslagen);
      } catch (error) {
        console.error("Error loading verslagen:", error);
        setError("Failed to load reports");
      }
    };

    if (isOpen) {
      loadVerslagen();
    }
  }, [isOpen, vluchtCyclus.Id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!selectedVerslagId) {
      setError("Please select a report");
      setIsLoading(false);
      return;
    }

    try {
      await handleAttachVerslag(
        vluchtCyclus.Id,
        parseInt(selectedVerslagId),
        setError
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Error attaching verslag:", error);
      setError(
        error instanceof Error ? error.message : "Failed to attach report"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verslag Toevoegen</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="verslag_select" className="text-right">
                Verslag
              </Label>
              <Select
                value={selectedVerslagId}
                onValueChange={setSelectedVerslagId}
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
              {isLoading ? "Toevoegen..." : "Verslag Toevoegen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
