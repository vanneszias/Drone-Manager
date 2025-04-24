"use client"; // Make this a client component for interactions

import React from 'react';
import { Zone } from '@/app/types'; // Ensure you have a Zone type matching the API response
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
// import { Badge } from "@/components/ui/badge"; // Remove if not using type/status badges
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
          <TableHead>Naam</TableHead>
          <TableHead>Breedte (m)</TableHead>
          <TableHead>Lengte (m)</TableHead>
          <TableHead>Evenement ID</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {zones.map((zone) => (
          <TableRow key={zone.Id}>
            <TableCell className="font-medium">{zone.Id}</TableCell>
            <TableCell>{zone.naam}</TableCell>
            <TableCell>
              {zone.breedte.toFixed(2)} {/* Format numbers */}
            </TableCell>
            <TableCell>
              {zone.lengte.toFixed(2)} {/* Format numbers */}
            </TableCell>
            <TableCell>{zone.EvenementId}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" className="mr-2" disabled>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => useZones.handleDelete(zone.Id.toString())}> {/* ID is number, convert to string */}
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Delete</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Total Zones</TableCell> {/* Adjusted colSpan */}
          <TableCell className="text-right">{zones.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}