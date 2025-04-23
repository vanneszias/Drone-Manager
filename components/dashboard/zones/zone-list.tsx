"use client"; // Make this a client component for interactions

import React from 'react';
import { Zone } from '@/app/types'; // Zorg dat je een Zone type hebt
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
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import useZones from '@/hooks/useZones';

interface ZoneListProps {
  zones: Zone[];
}

export default function ZoneList({ zones }: ZoneListProps) {
  if (!zones || zones.length === 0) {
    return <p className="text-muted-foreground">No zones found.</p>;
  }

  return (
    <Table>
      <TableCaption>A list of your zones.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {zones.map((zone) => (
          <TableRow key={zone.Id}>
            <TableCell className="font-medium">{zone.Id}</TableCell>
            <TableCell>{zone.name}</TableCell>
            <TableCell>
              <Badge className={useZones.getTypeBadgeVariant(zone.type)}>{zone.type}</Badge>
            </TableCell>
            <TableCell>
              <Badge className={useZones.getStatusBadgeVariant(zone.status)}>{zone.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" className="mr-2" disabled>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => useZones.handleDelete(zone.Id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Delete</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total Zones</TableCell>
          <TableCell className="text-right">{zones.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}