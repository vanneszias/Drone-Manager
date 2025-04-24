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
    vluchtCycli: VluchtCyclus[];
}

export default function VluchtCyclusList({ vluchtCycli }: VluchtCyclusListProps) {
    const { handleDelete } = useVluchtCyclus;
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
            <TableCaption>A list of Vlucht Cycli.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Verslag ID</TableHead> {/* Nullable */}
                    <TableHead>Plaats ID</TableHead> {/* Nullable */}
                    <TableHead>Drone ID</TableHead> {/* Nullable */}
                    <TableHead>Zone ID</TableHead> {/* Nullable */}
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {vluchtCycli.map((vluchtCyclus) => (
                    <TableRow key={vluchtCyclus.Id}>
                        <TableCell className="font-medium">{vluchtCyclus.Id}</TableCell>
                        <TableCell>{vluchtCyclus.VerslagId ?? 'N/A'}</TableCell>
                        <TableCell>{vluchtCyclus.PlaatsId ?? 'N/A'}</TableCell>
                        <TableCell>{vluchtCyclus.DroneId ?? 'N/A'}</TableCell>
                        <TableCell>{vluchtCyclus.ZoneId ?? 'N/A'}</TableCell>
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
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={5}>Total Vlucht Cycli</TableCell>
                    <TableCell className="text-right">{vluchtCycli.length}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}