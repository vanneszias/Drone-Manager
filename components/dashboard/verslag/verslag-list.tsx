"use client";

import { Verslag } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import useVerslag from "@/hooks/useVerslag";
import { TrashIcon } from "lucide-react";

interface VerslagListProps {
  verslagen: Verslag[];
}

export function VerslagList({ verslagen }: VerslagListProps) {
  const { handleDelete } = useVerslag;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Onderwerp</TableHead>
            <TableHead>Beschrijving</TableHead>
            <TableHead>Drone ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {verslagen.map((verslag) => (
            <TableRow key={verslag.id}>
              <TableCell className="font-medium">{verslag.id}</TableCell>
              <TableCell>{verslag.onderwerp}</TableCell>
              <TableCell className="max-w-[300px] truncate">
                {verslag.beschrijving}
              </TableCell>
              <TableCell>{verslag.droneId}</TableCell>
              <TableCell>
                <Badge 
                  variant={verslag.isverzonden ? "default" : "secondary"}
                  className={verslag.isverzonden ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                >
                  {verslag.isverzonden ? "Verzonden" : "Niet verzonden"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(verslag.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {verslagen.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Geen verslagen gevonden
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}