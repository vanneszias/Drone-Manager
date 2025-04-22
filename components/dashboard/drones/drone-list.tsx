"use client"; // Make this a client component for potential interactions

import React from 'react';
import { Drone } from '@/app/types';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface DroneListProps {
  drones: Drone[];
}

// Helper to get badge color based on status
const getStatusBadgeVariant = (status: Drone['status']): string => {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-green-100 text-green-800';
    case 'IN_USE':
      return 'bg-blue-100 text-blue-800';
    case 'MAINTENANCE':
      return 'bg-yellow-100 text-yellow-800';
    case 'OFFLINE':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper to get battery color
const getBatteryColor = (level: number): string => {
    if (level > 70) return 'text-green-600';
    if (level > 30) return 'text-yellow-600';
    return 'text-red-600';
}

export default function DroneList({ drones }: DroneListProps) {

  const handleDelete = async (id: number) => {
      if (!confirm(`Are you sure you want to delete drone ${id}?`)) return;
      try {
          const res = await fetch(`/api/drones/${id}`, { method: 'DELETE' });
          if (res.ok) {
              alert('Drone deleted successfully');
              // TODO: Refresh data - Need a better way, e.g., router.refresh() or state management
              window.location.reload(); // Simple but not ideal
          } else {
              const errorData = await res.json();
              alert(`Failed to delete drone: ${errorData.error || res.statusText}`);
          }
      } catch (error) {
          console.error("Error deleting drone:", error);
          alert("An error occurred while deleting the drone.");
      }
  };

  if (!drones || drones.length === 0) {
    return <p className="text-muted-foreground">No drones found.</p>;
  }

  return (
    <Table>
      <TableCaption>A list of your drones.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Battery (%)</TableHead>
          <TableHead>Takeoff Ready</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {drones.map((drone) => (
          <TableRow key={drone.Id}>
            <TableCell className="font-medium">{drone.Id}</TableCell>
            <TableCell>
              <Badge className={getStatusBadgeVariant(drone.status)}>{drone.status}</Badge>
            </TableCell>
            <TableCell className={getBatteryColor(drone.batterij)}>
                {drone.batterij}%
            </TableCell>
            <TableCell>{drone.magOpstijgen ? 'Yes' : 'No'}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" className="mr-2" disabled> {/* Disabled until Edit form ready */}
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(drone.Id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
                 <span className="sr-only">Delete</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total Drones</TableCell>
          <TableCell className="text-right">{drones.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
