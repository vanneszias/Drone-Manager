"use client";

import React, { useState } from "react";
import { DockingCyclus } from "@/app/types";
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
import { Edit, Trash2 } from "lucide-react";
import useDockingCyclus from "@/hooks/useDockingCyclus";
import { EditDockingCyclusDialog } from "./edit-dockingcyclus-dialog";

interface DockingCyclusListProps {
  dockingCycli: DockingCyclus[];
}

export default function DockingCyclusList({
  dockingCycli,
}: DockingCyclusListProps) {
  const { handleDelete } = useDockingCyclus;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedDockingCyclus, setSelectedDockingCyclus] =
    useState<DockingCyclus | null>(null);

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
        <TableCaption>Een lijst van alle docking cycli.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Drone ID</TableHead>
            <TableHead>Docking ID</TableHead>
            <TableHead>Cyclus ID</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dockingCycli.map((dockingCyclus) => (
            <TableRow key={dockingCyclus.Id}>
              <TableCell className="font-medium">{dockingCyclus.Id}</TableCell>
              <TableCell>{dockingCyclus.DroneId ?? "N/A"}</TableCell>
              <TableCell>{dockingCyclus.DockingId ?? "N/A"}</TableCell>
              <TableCell>{dockingCyclus.CyclusId ?? "N/A"}</TableCell>
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
