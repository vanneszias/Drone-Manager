"use client";

import React from 'react';
import { Event } from '@/app/types';
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
import useEvents from '@/hooks/useEvents';

interface EventListProps {
  events: Event[];
}

export default function EventList({ events }: EventListProps) {

  if (!events || events.length === 0) {
    return <p className="text-muted-foreground">No events found.</p>;
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
    // Add check before substring
    if (typeof timeString === 'string' && timeString.length >= 5) {
      return timeString.substring(0, 5);
    }
    console.warn("Invalid or short time string:", timeString);
    return timeString; // Return original if invalid or too short
  };


  return (
    <Table>
      <TableCaption>A list of your events.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.Id}>
            <TableCell className="font-medium">{event.Id}</TableCell>
            <TableCell>{event.Naam}</TableCell>
            <TableCell>{formatDate(event.StartDatum)}</TableCell>
            <TableCell>{formatTime(event.StartTijd)}</TableCell>
            <TableCell>{formatDate(event.EindDatum)}</TableCell>
            <TableCell>{event.Tijdsduur}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" className="mr-2" disabled>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => useEvents.handleDelete(event.Id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Delete</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6}>Total Events</TableCell>
          <TableCell className="text-right">{events.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}