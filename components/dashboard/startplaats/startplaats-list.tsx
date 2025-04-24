"use client";

import React from 'react';
import { Startplaats } from '@/app/types';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge"; // Import Badge
import { Trash2, Edit } from 'lucide-react'; // Import Edit icon
import useStartplaats from '@/hooks/useStartplaats';

interface StartplaatsListProps {
  startplaats: Startplaats[];
}

export default function StartplaatsList({ startplaats }: StartplaatsListProps) {
  const { handleDelete } = useStartplaats;
  if (!startplaats || startplaats.length === 0) {
    return <p className="text-muted-foreground">No startplaats found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Locatie</TableHead>
          <TableHead>Beschikbaar</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {startplaats.map((sp) => ( // Renamed variable to avoid conflict
          <TableRow key={sp.id}>
            <TableCell>{sp.id}</TableCell>
            <TableCell>{sp.locatie}</TableCell>
            <TableCell>
              <Badge
                variant={sp.isbeschikbaar ? "default" : "secondary"}
                className={sp.isbeschikbaar ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
              >
                {sp.isbeschikbaar ? 'Yes' : 'No'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" className="mr-2" disabled> {/* Edit button disabled */}
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(sp.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Delete</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}