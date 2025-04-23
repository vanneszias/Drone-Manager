"use client";

import React from "react";
import { Docking } from "@/app/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // Import Badge
import useDockings from "@/hooks/useDockings";

interface DockingListProps {
  dockings: Docking[];

}

export default function DockingList({ dockings }: DockingListProps) {
  if (!dockings || dockings.length === 0) {
    return <p className="text-muted-foreground">No dockings found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Available</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dockings.map((docking) => (
          <TableRow key={docking.id}>
            <TableCell>{docking.id}</TableCell>
            <TableCell>{docking.locatie}</TableCell>
            <TableCell>
              <Badge
                variant={docking.isbeschikbaar ? "default" : "secondary"}
                className={docking.isbeschikbaar ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
              >
                {docking.isbeschikbaar ? 'Yes' : 'No'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" disabled>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => useDockings.handleDelete(docking.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Dockings</TableCell> {/* Adjust colSpan */}
          <TableCell className="text-right">{dockings.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}