"use client";

import React, { useState } from 'react';
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
import { Drone } from '@/app/types';
import { PlusCircle } from 'lucide-react';
import useDrones from '@/hooks/useDrones';

type DroneFormData = {
  status: Drone['status'];
  batterij: number;
  magOpstijgen: boolean;
};

// Type for data sent to API
type DroneApiInput = {
  status: Drone['status'];
  batterij: number;
  mag_opstijgen: boolean; // Use snake_case for API
};

export function AddDroneDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<DroneFormData>({ // Use full type, provide defaults
    status: 'OFFLINE', // Default status
    magOpstijgen: false,
    batterij: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
    }));
  };

  const handleSelectChange = (value: Drone['status']) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prepare data for API (snake_case)
    const apiData: DroneApiInput = {
      status: formData.status,
      batterij: formData.batterij,
      mag_opstijgen: formData.magOpstijgen, // Send snake_case
    };
    useDrones.handleAddDrone(apiData, setIsLoading, setError, setIsOpen, () => setFormData({ status: 'OFFLINE', batterij: 0, magOpstijgen: false }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Drone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Drone</DialogTitle>
          <DialogDescription>
            Enter the details for the new drone. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Add fields for Naam and Model if needed */}
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="naam" className="text-right">Name</Label>
              <Input id="naam" value={formData.naam || ''} onChange={handleInputChange} className="col-span-3" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="model" className="text-right">Model</Label>
               <Input id="model" value={formData.model || ''} onChange={handleInputChange} className="col-span-3" required />
             </div> */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select onValueChange={handleSelectChange} defaultValue={formData.status}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="IN_USE">In Use</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="OFFLINE">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="batterij" className="text-right">Battery (%)</Label>
              <Input
                id="batterij"
                type="number"
                min="0"
                max="100"
                value={formData.batterij ?? ''}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="magOpstijgen" className="text-right">Ready for Takeoff</Label> {/* Keep UI ID camelCase for state */}
              {/* Simple Checkbox - consider using Shadcn's Checkbox component */}
              <input
                id="magOpstijgen"
                type="checkbox"
                checked={formData.magOpstijgen || false}
                onChange={handleInputChange}
                className="col-span-3 h-4 w-4 justify-self-start"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Drone'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}