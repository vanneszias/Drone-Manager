"use client";

import React, { useState } from "react";
import { Drone } from "@/app/types";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import useDrones from "@/hooks/useDrones";
import { EditDroneDialog } from "./edit-drone-dialog";

interface DroneListProps {
  drones: Drone[];
}

export default function DroneList({ drones }: DroneListProps) {
  const { handleDelete } = useDrones;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);

  const handleEdit = (drone: Drone) => {
    setSelectedDrone(drone);
    setIsEditOpen(true);
  };

  if (!drones || drones.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <p className="text-muted-foreground">Geen drones gevonden.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Klik op 'Nieuwe Drone' om er een toe te voegen.
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadgeStyle = (status: Drone["status"]) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800";
      case "IN_USE":
        return "bg-blue-100 text-blue-800";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-800";
      case "OFFLINE":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Batterij (%)</TableHead>
            <TableHead>Mag Opstijgen</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drones.map((drone) => (
            <TableRow key={drone.Id}>
              <TableCell className="font-medium">{drone.Id}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusBadgeStyle(drone.status)}
                >
                  {drone.status}
                </Badge>
              </TableCell>
              <TableCell>{drone.batterij}%</TableCell>
              <TableCell>
                <Badge
                  variant={drone.magOpstijgen ? "default" : "secondary"}
                  className={
                    drone.magOpstijgen
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {drone.magOpstijgen ? "Ja" : "Nee"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={() => handleEdit(drone)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Bewerk drone</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(drone.Id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Verwijder drone</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Totaal Drones</TableCell>
            <TableCell className="text-right">{drones.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {selectedDrone && (
        <EditDroneDialog
          drone={selectedDrone}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
        />
      )}
    </>
  );
}
