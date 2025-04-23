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
  TableFooter,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import useVerslag from "@/hooks/useVerslag";
import { TrashIcon } from "lucide-react";
import Link from "next/link"; // Optional: Link to VluchtCyclus details

interface VerslagListProps {
  verslagen: Verslag[];
}

export function VerslagList({ verslagen }: VerslagListProps) {
  const { handleDelete } = useVerslag;

  if (!verslagen || verslagen.length === 0) {
    return (
      <div className="rounded-md border p-4 text-center">
        <p className="text-muted-foreground">No verslagen found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>A list of recent verslagen.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Content (Preview)</TableHead>
            <TableHead>Flight Cycle ID</TableHead> {/* New Column */}
            <TableHead>Sent</TableHead>
            <TableHead>Accepted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {verslagen.map((verslag) => (
            <TableRow key={verslag.Id}>
              <TableCell className="font-medium">{verslag.Id}</TableCell>
              <TableCell>{verslag.onderwerp}</TableCell>
              <TableCell className="max-w-[300px] truncate" title={verslag.inhoud}>
                {verslag.inhoud}
              </TableCell>
              <TableCell>
                {/* Display the ID, optionally make it a link */}
                {verslag.VluchtCyclusId ? (
                  // Optional: Link to a details page for the VluchtCyclus
                  // <Link href={`/dashboard/vlucht-cycli/${verslag.VluchtCyclusId}`} className="underline text-blue-600 hover:text-blue-800">
                  //     {verslag.VluchtCyclusId}
                  // </Link>
                  verslag.VluchtCyclusId
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={verslag.isverzonden ? "default" : "secondary"}
                  className={verslag.isverzonden ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                >
                  {verslag.isverzonden ? "Yes" : "No"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={verslag.isgeaccepteerd ? "default" : "secondary"}
                  className={verslag.isgeaccepteerd ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                >
                  {verslag.isgeaccepteerd ? "Yes" : "No"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(verslag.Id)}
                  title="Delete Verslag"
                >
                  <TrashIcon className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>Total Verslagen</TableCell> {/* Adjusted colSpan */}
            <TableCell className="text-right">{verslagen.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}