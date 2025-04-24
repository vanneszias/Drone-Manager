"use client";

import React from "react";
import { Startplaats } from "@/app/types";
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
import useStartplaats from "@/hooks/useStartplaats";

interface StartplaatsListProps {
  startplaatsen: Startplaats[];
}

export default function StartplaatsList({
  startplaatsen,
}: StartplaatsListProps) {
  const { handleDelete } = useStartplaats;

  if (!startplaatsen || startplaatsen.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <p className="text-muted-foreground">Geen startplaatsen gevonden.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Klik op 'Nieuwe Startplaats' om er een toe te voegen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Een lijst van alle startplaatsen.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Locatie</TableHead>
          <TableHead>Beschikbaarheid</TableHead>
          <TableHead className="text-right">Acties</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {startplaatsen.map((startplaats) => (
          <TableRow key={startplaats.id}>
            <TableCell className="font-medium">{startplaats.id}</TableCell>
            <TableCell>{startplaats.locatie}</TableCell>
            <TableCell>
              <Badge
                variant={startplaats.isbeschikbaar ? "default" : "secondary"}
                className={
                  startplaats.isbeschikbaar
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {startplaats.isbeschikbaar ? "Beschikbaar" : "Niet Beschikbaar"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" className="mr-2" disabled>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Bewerk startplaats</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(startplaats.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Verwijder startplaats</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Totaal Startplaatsen</TableCell>
          <TableCell className="text-right">{startplaatsen.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
