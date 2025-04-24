"use client";

import React, { useState } from "react";
import { VluchtCyclus } from "@/app/types";
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
import useVluchtCyclus from "@/hooks/useVluchtCyclus";
import { EditVluchtCyclusDialog } from "./edit-vluchtcyclus-dialog";

interface VluchtCyclusListProps {
  vluchtCycli: VluchtCyclus[];
}

export default function VluchtCyclusList({
  vluchtCycli,
}: VluchtCyclusListProps) {
  const { handleDelete } = useVluchtCyclus;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedVluchtCyclus, setSelectedVluchtCyclus] =
    useState<VluchtCyclus | null>(null);

  const handleEdit = (vluchtCyclus: VluchtCyclus) => {
    setSelectedVluchtCyclus(vluchtCyclus);
    setIsEditOpen(true);
  };

  if (!vluchtCycli || vluchtCycli.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <p className="text-muted-foreground">Geen vlucht cycli gevonden.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Klik op 'Nieuwe Vlucht Cyclus' om er een toe te voegen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableCaption>Een lijst van alle vlucht cycli.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Verslag ID</TableHead>
            <TableHead>Plaats ID</TableHead>
            <TableHead>Drone ID</TableHead>
            <TableHead>Zone ID</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vluchtCycli.map((vluchtCyclus) => (
            <TableRow key={vluchtCyclus.Id}>
              <TableCell className="font-medium">{vluchtCyclus.Id}</TableCell>
              <TableCell>{vluchtCyclus.VerslagId ?? "N/A"}</TableCell>
              <TableCell>{vluchtCyclus.PlaatsId ?? "N/A"}</TableCell>
              <TableCell>{vluchtCyclus.DroneId ?? "N/A"}</TableCell>
              <TableCell>{vluchtCyclus.ZoneId ?? "N/A"}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={() => handleEdit(vluchtCyclus)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Bewerk vlucht cyclus</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(vluchtCyclus.Id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Verwijder vlucht cyclus</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Totaal Vlucht Cycli</TableCell>
            <TableCell className="text-right">{vluchtCycli.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {selectedVluchtCyclus && (
        <EditVluchtCyclusDialog
          vluchtCyclus={selectedVluchtCyclus}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
        />
      )}
    </>
  );
}
