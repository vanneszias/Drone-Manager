"use client"; // Client component for interactions like delete

import React from 'react';
import { Event } from '@/app/types'; // Import the Event type
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
import useEvents from '@/hooks/useEvents'; // Import the events hook

interface EventListProps {
  events: Event[]; // Use the Event type
}

export default function EventList({ events }: EventListProps) {

  if (!events || events.length === 0) {
    return <p className="text-muted-foreground">No events found.</p>;
  }

  // Helper function to format date/time if needed (optional)
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(); // Basic date formatting
    } catch (e) {
      return dateString; // Return original if invalid
    }
  };

  const formatTime = (timeString: string) => {
    // Basic time formatting (assuming HH:MM or HH:MM:SS)
    return timeString.substring(0, 5);
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
          <TableRow key={event.id}>
            <TableCell className="font-medium">{event.id}</TableCell>
            <TableCell>{event.naam}</TableCell>
            <TableCell>{formatDate(event.start_datum)}</TableCell>
            <TableCell>{formatTime(event.start_tijd)}</TableCell>
            <TableCell>{formatDate(event.eind_datum)}</TableCell>
            <TableCell>{event.tijdsduur}</TableCell> {/* Display duration as is for now */}
            <TableCell className="text-right">
              {/* Edit button - disabled for now */}
              <Button variant="ghost" size="icon" className="mr-2" disabled>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              {/* Delete button - uses handleDeleteEvent from the hook */}
              <Button variant="ghost" size="icon" onClick={() => useEvents.handleDelete(event.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
                 <span className="sr-only">Delete</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          {/* Adjust colSpan based on the number of columns */}
          <TableCell colSpan={6}>Total Events</TableCell>
          <TableCell className="text-right">{events.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
