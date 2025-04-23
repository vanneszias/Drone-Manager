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
          <TableHead>Name</TableHead>
          <TableHead>Location</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dockings.map((docking) => (
          <TableRow key={docking.id}>
            <TableCell>{docking.id}</TableCell>
            <TableCell>{docking.naam}</TableCell>
            <TableCell>{docking.locatie}</TableCell>
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
          <TableCell colSpan={3}>Total Dockings</TableCell>
          <TableCell className="text-right">{dockings.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}