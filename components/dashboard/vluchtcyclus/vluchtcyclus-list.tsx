"use client";

import React from 'react';
import { VluchtCyclus } from '@/app/types';
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
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import useVluchtCyclus from '@/hooks/useVluchtCyclus';

interface VluchtCyclusListProps {
  vluchtcyclussen: VluchtCyclus[];
}

export default function VluchtCyclusList({ vluchtcyclussen }: VluchtCyclusListProps) {
  const { handleDelete } = useVluchtCyclus;

  if (!vluchtcyclussen || vluchtcyclussen.length === 0) {
    return <p className="text-muted-foreground">Geen vluchtcyclussen gevonden.</p>;
  }

  return (
    <Table>
      <TableCaption>Een lijst van alle vluchtcyclussen.</TableCaption>
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
        {vluchtcyclussen.map((vluchtcyclus) => (
          <TableRow key={vluchtcyclus.Id}>
            <TableCell className="font-medium">{vluchtcyclus.Id}</TableCell>
            <TableCell>{vluchtcyclus.VerslagId}</TableCell>
            <TableCell>{vluchtcyclus.PlaatsId}</TableCell>
            <TableCell>{vluchtcyclus.DroneId}</TableCell>
            <TableCell>{vluchtcyclus.ZoneId}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" className="mr-2" disabled>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Bewerk</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleDelete(vluchtcyclus.Id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Verwijder</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Totaal Vluchtcyclussen</TableCell>
          <TableCell className="text-right">{vluchtcyclussen.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}