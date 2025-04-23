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
import useDrones from '@/hooks/useDrones';

interface DroneListProps {
  drones: Drone[];
}

export default function DroneList({ drones }: DroneListProps) {

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
          <TableRow key={drone.id}>
            <TableCell className="font-medium">{drone.id}</TableCell>
            <TableCell>
              <Badge className={useDrones.getStatusBadgeVariant(drone.status)}>{drone.status}</Badge>
            </TableCell>
            <TableCell className={useDrones.getBatteryColor(drone.batterij)}>
                {drone.batterij}%
            </TableCell>
            <TableCell>{drone.magOpstijgen ? 'Yes' : 'No'}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" className="mr-2" disabled> {/* Disabled until Edit form ready */}
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => useDrones.handleDelete(drone.id)}>
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
