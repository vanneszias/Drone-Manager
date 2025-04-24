"use client";

import React from "react";
import { Verslag } from "@/app/types";
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
import useVerslag from "@/hooks/useVerslag";

interface VerslagListProps {
  verslagen: Verslag[];
}

export default function VerslagList({ verslagen }: VerslagListProps) {
  const { handleDelete } = useVerslag;

  if (!verslagen || verslagen.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <p className="text-muted-foreground">Geen verslagen gevonden.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Klik op 'Nieuw Verslag' om er een toe te voegen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Een lijst van alle verslagen.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Onderwerp</TableHead>
          <TableHead>Inhoud</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>VluchtCyclus ID</TableHead>
          <TableHead className="text-right">Acties</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {verslagen.map((verslag) => (
          <TableRow key={verslag.Id}>
            <TableCell className="font-medium">{verslag.Id}</TableCell>
            <TableCell>{verslag.onderwerp}</TableCell>
            <TableCell className="max-w-[200px] truncate">
              {verslag.inhoud}
            </TableCell>
            <TableCell>
              <div className="space-x-2">
                <Badge
                  variant={verslag.isverzonden ? "default" : "secondary"}
                  className={
                    verslag.isverzonden
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {verslag.isverzonden ? "Verzonden" : "Concept"}
                </Badge>
                {verslag.isverzonden && (
                  <Badge
                    variant={verslag.isgeaccepteerd ? "default" : "secondary"}
                    className={
                      verslag.isgeaccepteerd
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {verslag.isgeaccepteerd
                      ? "Geaccepteerd"
                      : "Niet Geaccepteerd"}
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>{verslag.VluchtCyclusId ?? "N/A"}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" className="mr-2" disabled>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Bewerk verslag</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(verslag.Id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Verwijder verslag</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Totaal Verslagen</TableCell>
          <TableCell className="text-right">{verslagen.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
