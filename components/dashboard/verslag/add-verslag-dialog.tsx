"use client";

import { useState, useEffect } from "react"; // Added useEffect
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
// Import Select if using dropdown for VluchtCyclusId
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import useVerslag from "@/hooks/useVerslag";
import { Verslag } from "@/app/types";
// Import hook to fetch VluchtCycli if using dropdown
// import useVluchtCycli from "@/hooks/useVluchtCycli"; // Assuming this hook exists

// Define the input type matching the hook's expectation
interface VerslagInput {
  onderwerp: string;
  inhoud: string;
  vlucht_cyclus_id?: number | null | string; // Allow string for input field value
}

export function AddVerslagDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<VerslagInput>({
    onderwerp: "",
    inhoud: "",
    vlucht_cyclus_id: null, // Initialize as null for input
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    setFormData({ onderwerp: "", inhoud: "", vlucht_cyclus_id: "" });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Pass the current formData (including vlucht_cyclus_id as string/null)
    // The hook will handle converting it to number if valid
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
            {/* Onderwerp */}
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
            {/* Inhoud */}
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
            {/* VluchtCyclus ID */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vlucht_cyclus_id" className="text-right">
                Flight Cycle ID{" "}
                <span className="text-xs text-muted-foreground">
                  (Optional)
                </span>
              </Label>
              {/* Option 1: Simple Input */}
              <Input
                id="vlucht_cyclus_id"
                type="number"
                min="1" // Prevent negative numbers
                value={formData.vlucht_cyclus_id ?? ""} // Handle null/undefined for input value
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Enter ID if known"
              />
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
