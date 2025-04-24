"use client";

import React, { useState, useEffect } from "react";
import { Cyclus, VluchtCyclus } from "@/app/types";
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
import useCyclus from "@/hooks/useCyclus";
import useVluchtCyclus from "@/hooks/useVluchtCyclus";
import { EditCyclusDialog } from "./edit-cyclus-dialog";

interface CyclusListProps {
  cycli: Cyclus[];
}

export default function CyclusList({ cycli }: CyclusListProps) {
  const { handleDelete } = useCyclus;
  const { getVluchtCycli } = useVluchtCyclus;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCyclus, setSelectedCyclus] = useState<Cyclus | null>(null);
  const [vluchtCycli, setVluchtCycli] = useState<VluchtCyclus[]>([]);

  const handleEdit = (cyclus: Cyclus) => {
    setSelectedCyclus(cyclus);
    setIsEditOpen(true);
  };

  useEffect(() => {
    const loadVluchtCycli = async () => {
      try {
        const data = await getVluchtCycli();
        setVluchtCycli(data);
      } catch (error) {
        console.error("Error loading vluchtcycli:", error);
      }
    };
    loadVluchtCycli();
  }, []);

  const getVluchtCyclusDetails = (id: number | null | undefined) => {
    if (!id) return "Geen vluchtcyclus";
    const vluchtCyclus = vluchtCycli.find((vc) => vc.Id === id);
    if (!vluchtCyclus) return `Vluchtcyclus ${id}`;

    const details = [];
    if (vluchtCyclus.DroneId) details.push(`Drone ${vluchtCyclus.DroneId}`);
    if (vluchtCyclus.ZoneId) details.push(`Zone ${vluchtCyclus.ZoneId}`);
    if (vluchtCyclus.PlaatsId) details.push(`Plaats ${vluchtCyclus.PlaatsId}`);

    return details.length > 0 ? details.join(" | ") : `Vluchtcyclus ${id}`;
  };

  if (!cycli || cycli.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <p className="text-muted-foreground">Geen cycli gevonden.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Klik op 'Nieuwe Cyclus' om er een toe te voegen.
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
            <TableHead>Start Uur</TableHead>
            <TableHead>Tijdstip</TableHead>
            <TableHead>Vluchtcyclus Details</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cycli.map((cyclus) => (
            <TableRow key={cyclus.Id}>
              <TableCell className="font-medium">{cyclus.Id}</TableCell>
              <TableCell>{cyclus.startuur}</TableCell>
              <TableCell>{cyclus.tijdstip}</TableCell>
              <TableCell>
                {getVluchtCyclusDetails(cyclus.VluchtCyclusId)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={() => handleEdit(cyclus)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Bewerk cyclus</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(cyclus.Id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Verwijder cyclus</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Totaal Cycli</TableCell>
            <TableCell className="text-right">{cycli.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {selectedCyclus && (
        <EditCyclusDialog
          cyclus={selectedCyclus}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
        />
      )}
    </>
  );
}
