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
import { handleDelete, handleAddVluchtCyclus, getVluchtCycli } from '@/hooks/useVluchtCyclus';

interface VluchtCyclusListProps {
    vluchtCycli: VluchtCyclus[];
}

export default function VluchtCyclusList({ vluchtCycli }: VluchtCyclusListProps) {
    if (!vluchtCycli || vluchtCycli.length === 0) {
        return <p className="text-muted-foreground">No flight cycles found.</p>;
    }

    const formatDate = (dateString: string | undefined | null): string => {
        if (!dateString) return 'N/A'; // Handle potential undefined/null
        try {
            // Optional: Add more robust date parsing if needed
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            console.warn("Invalid date string:", dateString);
            return dateString; // Return original if invalid
        }
    };

    const formatTime = (timeString: string | undefined | null): string => {
        if (!timeString) return 'N/A'; // Handle potential undefined/null
        if (typeof timeString === 'string' && timeString.length >= 5) {
            return timeString.substring(0, 5);
        }
        console.warn("Invalid or short time string:", timeString);
        return timeString; // Return original if invalid or too short
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Verslag ID</TableHead>
                    <TableHead>Plaats ID</TableHead>
                    <TableHead>Drone ID</TableHead>
                    <TableHead>Zone ID</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {vluchtCycli.map((vluchtCyclus) => (
                    <TableRow key={vluchtCyclus.Id}>
                        <TableCell>{vluchtCyclus.VerslagId}</TableCell>
                        <TableCell>{vluchtCyclus.PlaatsId}</TableCell>
                        <TableCell>{vluchtCyclus.DroneId}</TableCell>
                        <TableCell>{vluchtCyclus.ZoneId}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="mr-2" disabled>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(vluchtCyclus.Id)}>
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
