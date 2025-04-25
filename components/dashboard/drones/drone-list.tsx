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
      <div className="card-base">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-center space-y-2">
            <p className="text-white/70">No drones found</p>
            <p className="text-sm text-white/60">
              Click 'New Drone' to add one
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadgeStyle = (status: Drone["status"]) => {
    switch (status) {
      case "AVAILABLE":
        return "glass-effect bg-emerald-500/10 text-emerald-400";
      case "IN_USE":
        return "glass-effect bg-blue-500/10 text-blue-400";
      case "MAINTENANCE":
        return "glass-effect bg-yellow-500/10 text-yellow-400";
      case "OFFLINE":
        return "glass-effect bg-gray-500/10 text-gray-400";
      default:
        return "glass-effect bg-gray-500/10 text-gray-400";
    }
  };

  return (
    <div className="glass-effect rounded-lg border border-white/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10">
            <TableHead className="w-[100px] text-white/70">ID</TableHead>
            <TableHead className="text-white/70">Status</TableHead>
            <TableHead className="text-white/70">Battery (%)</TableHead>
            <TableHead className="text-white/70">Can Take Off</TableHead>
            <TableHead className="text-right text-white/70">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drones.map((drone) => (
            <TableRow key={drone.Id} className="border-white/10">
              <TableCell className="font-medium text-white/80">
                {drone.Id}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusBadgeStyle(drone.status)}
                >
                  {drone.status}
                </Badge>
              </TableCell>
              <TableCell className="text-white/70">{drone.batterij}%</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    drone.magOpstijgen
                      ? "glass-effect bg-emerald-500/10 text-emerald-400"
                      : "glass-effect bg-red-500/10 text-red-400"
                  }
                >
                  {drone.magOpstijgen ? "Yes" : "No"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 hover:glass-effect-strong"
                  onClick={() => handleEdit(drone)}
                >
                  <Edit className="h-4 w-4 text-white/70" />
                  <span className="sr-only">Edit drone</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:glass-effect-strong"
                  onClick={() => handleDelete(drone.Id)}
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                  <span className="sr-only">Delete drone</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="border-white/10">
            <TableCell colSpan={4} className="text-white/70">
              Total Drones
            </TableCell>
            <TableCell className="text-right text-white/70">
              {drones.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
