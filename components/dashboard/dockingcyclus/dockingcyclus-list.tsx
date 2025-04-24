"use client";

import React, { useState, useEffect } from "react";
import { DockingCyclus, Drone, Docking, Cyclus } from "@/app/types";
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
import useDockingCyclus from "@/hooks/useDockingCyclus";
import { EditDockingCyclusDialog } from "./edit-dockingcyclus-dialog";

interface DockingCyclusListProps {
  dockingCycli: DockingCyclus[];
}

export default function DockingCyclusList({
  dockingCycli,
}: DockingCyclusListProps) {
  const { handleDelete, getDrones, getDockings, getCycli } = useDockingCyclus;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedDockingCyclus, setSelectedDockingCyclus] =
    useState<DockingCyclus | null>(null);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [dockings, setDockings] = useState<Docking[]>([]);
  const [cycli, setCycli] = useState<Cyclus[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [droneData, dockingData, cyclusData] = await Promise.all([
          getDrones(),
          getDockings(),
          getCycli(),
        ]);
        setDrones(droneData);
        setDockings(dockingData);
        setCycli(cyclusData);
      } catch (error) {
        console.error("Error loading related data:", error);
      }
    };
    loadData();
  }, []);

  const getDroneDetails = (droneId: number) => {
    const drone = drones.find((d) => d.Id === droneId);
    if (!drone) return `Drone #${droneId}`;
    return (
      <div className="space-y-1">
        <div className="font-medium">Drone #{droneId}</div>
        <Badge
          variant="secondary"
          className={
            drone.status === "AVAILABLE"
              ? "bg-green-100 text-green-800"
              : drone.status === "IN_USE"
              ? "bg-blue-100 text-blue-800"
              : drone.status === "MAINTENANCE"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }
        >
          {drone.status}
        </Badge>
        <div className="text-sm text-muted-foreground">
          Batterij: {drone.batterij}%
        </div>
      </div>
    );
  };

  const getDockingDetails = (dockingId: number) => {
    const docking = dockings.find((d) => d.Id === dockingId);
    if (!docking) return `Docking #${dockingId}`;
    return (
      <div className="space-y-1">
        <div className="font-medium">Docking #{dockingId}</div>
        <div className="text-sm">{docking.locatie}</div>
        <Badge
          variant={docking.isbeschikbaar ? "default" : "secondary"}
          className={
            docking.isbeschikbaar
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
        >
          {docking.isbeschikbaar ? "Beschikbaar" : "Bezet"}
        </Badge>
      </div>
    );
  };

  const getCyclusDetails = (cyclusId: number) => {
    const cyclus = cycli.find((c) => c.Id === cyclusId);
    if (!cyclus) return `Cyclus #${cyclusId}`;
    return (
      <div className="space-y-1">
        <div className="font-medium">Cyclus #{cyclusId}</div>
        <div className="text-sm">Start: {cyclus.startuur}</div>
        <div className="text-sm">Tijdstip: {cyclus.tijdstip}</div>
      </div>
    );
  };

  const handleEdit = (dockingCyclus: DockingCyclus) => {
    setSelectedDockingCyclus(dockingCyclus);
    setIsEditOpen(true);
  };

  if (!dockingCycli || dockingCycli.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <p className="text-muted-foreground">Geen docking cycli gevonden.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Klik op 'Nieuwe Docking Cyclus' om er een toe te voegen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Drone Details</TableHead>
            <TableHead>Docking Details</TableHead>
            <TableHead>Cyclus Details</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dockingCycli.map((dockingCyclus) => (
            <TableRow key={dockingCyclus.Id}>
              <TableCell className="font-medium">{dockingCyclus.Id}</TableCell>
              <TableCell>{getDroneDetails(dockingCyclus.DroneId)}</TableCell>
              <TableCell>
                {getDockingDetails(dockingCyclus.DockingId)}
              </TableCell>
              <TableCell>{getCyclusDetails(dockingCyclus.CyclusId)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={() => handleEdit(dockingCyclus)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Bewerk docking cyclus</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(dockingCyclus.Id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Verwijder docking cyclus</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Totaal Docking Cycli</TableCell>
            <TableCell className="text-right">{dockingCycli.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {selectedDockingCyclus && (
        <EditDockingCyclusDialog
          dockingCyclus={selectedDockingCyclus}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
        />
      )}
    </>
  );
}
