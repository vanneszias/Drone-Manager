"use client";

import { Cyclus } from "@/app/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import useCyclus from "@/hooks/useCyclus";

interface CyclusListProps {
  cycli: Cyclus[];
}

export default function CyclusList({ cycli }: CyclusListProps) {
  const { handleDelete } = useCyclus;

  if (!cycli || cycli.length === 0) {
    return <p className="text-muted-foreground">Geen cycli gevonden.</p>;
  }

  return (
    <Table>
      <TableCaption>Een lijst van alle cycli.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Start Uur</TableHead>
          <TableHead>Tijdsduur</TableHead>
          <TableHead>Vluchtcyclus ID</TableHead>
          <TableHead className="text-right">Acties</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cycli.map((cyclus) => (
          <TableRow key={cyclus.id}>
            <TableCell className="font-medium">{cyclus.id}</TableCell>
            <TableCell>{cyclus.startuur}</TableCell>
            <TableCell>{cyclus.tijdsduur}</TableCell>
            <TableCell>{cyclus.vluchtcyclusId}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(cyclus.id)}
              >
                <TrashIcon className="h-4 w-4" />
                <span className="sr-only">Verwijder cyclus</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}