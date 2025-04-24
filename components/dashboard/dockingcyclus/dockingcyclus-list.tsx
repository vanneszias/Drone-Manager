"use client";

import React from "react";
import { DockingCyclus } from "@/app/types";

interface DockingCyclusListProps {
  dockingCycli: DockingCyclus[];
}

export default function DockingCyclusList({
  dockingCycli,
}: DockingCyclusListProps) {
  if (!dockingCycli || dockingCycli.length === 0) {
    return <p className="text-muted-foreground">Geen docking cycli gevonden.</p>;
  }

  return (
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
            <TableCell>{dockingCyclus.DroneId}</TableCell>
            <TableCell>{dockingCyclus.DockingId}</TableCell>
            <TableCell>{dockingCyclus.CyclusId}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" className="mr-2" disabled>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Bewerken</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => useDockingCyclus.handleDelete(dockingCyclus.Id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Verwijderen</span>
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
  );
}
