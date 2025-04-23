"use client";

import React from 'react';
import { Startplaats } from '@/app/types';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import useStartplaats from '@/hooks/useStartplaats';

interface StartplaatsListProps {
  startplaats: Startplaats[];
}

export default function StartplaatsList({ startplaats }: StartplaatsListProps) {
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
        {startplaats.map((startplaats) => (
          <TableRow key={startplaats.id}>
            <TableCell>{startplaats.id}</TableCell>
            <TableCell>{startplaats.locatie}</TableCell>
            <TableCell>{startplaats.isBeschikbaar ? 'Yes' : 'No'}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" onClick={() => useStartplaats.handleDelete(startplaats.id)}>
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