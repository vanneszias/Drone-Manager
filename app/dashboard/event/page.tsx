import React from 'react';
import EventList from '@/components/dashboard/event/event-list';
import { AddEventDialog } from '@/components/dashboard/event/add-event-dialog';
import useEvents from '@/hooks/useEvents';

export default async function EventsPage() {
  try {
      // Fetch events using the hook
      const events = await useEvents.getEvents();

      return (
        <div className="container mx-auto py-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Event Management</h1>
            {/* Render the Add Event Dialog Trigger */}
            <AddEventDialog />
          </div>
          {/* Pass the fetched events to the client component */}
          {/* Assuming EventList component will be created */}
          <EventList events={events} />
        </div>
      );
  } catch (error) {
      // Basic error handling similar to DronesPage
      console.error("Error rendering EventsPage:", error);
      return (
          <div className="container mx-auto py-10 text-center text-red-500">
              <h1 className="text-2xl font-bold mb-4">Error Loading Events</h1>
              <p>{error instanceof Error ? error.message : "An unknown error occurred."}</p>
              <p>Please check the console logs for more details.</p>
          </div>
      );
  }
}
