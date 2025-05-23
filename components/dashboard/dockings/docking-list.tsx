"use client";

import React, { useState } from "react";
import { Docking } from "@/app/types";
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
import useDockings from "@/hooks/useDockings";
import { EditDockingDialog } from "./edit-docking-dialog";

interface DockingListProps {
  dockings: Docking[];
}

export default function DockingList({ dockings }: DockingListProps) {
  const { handleDelete } = useDockings;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedDocking, setSelectedDocking] = useState<Docking | null>(null);

  const handleEdit = (docking: Docking) => {
    setSelectedDocking(docking);
    setIsEditOpen(true);
  };

  if (!dockings || dockings.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <p className="text-muted-foreground">Geen dockings gevonden.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Klik op 'Nieuwe Docking' om er een toe te voegen.
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
            <TableHead>Locatie</TableHead>
            <TableHead>Beschikbaarheid</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dockings.map((docking) => (
            <TableRow key={docking.Id}>
              <TableCell className="font-medium">{docking.Id}</TableCell>
              <TableCell>{docking.locatie}</TableCell>
              <TableCell>
                <Badge
                  variant={docking.isbeschikbaar ? "default" : "secondary"}
                  className={
                    docking.isbeschikbaar
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {docking.isbeschikbaar ? "Beschikbaar" : "Niet Beschikbaar"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={() => handleEdit(docking)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Bewerk docking</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(docking.Id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Verwijder docking</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Totaal Dockings</TableCell>
            <TableCell className="text-right">{dockings.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {selectedDocking && (
        <EditDockingDialog
          docking={selectedDocking}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
        />
      )}
    </>
  );
}
