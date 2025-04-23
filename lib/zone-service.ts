// lib/zone-service.ts

import { Zone } from '@/app/types';

// Functie voor het ophalen van alle zones
export async function getZones(): Promise<Zone[]> {
  try {
    // Gebruik absolute URL voor externe API's of relatieve URL voor interne API routes
    const response = await fetch('http://your-api-endpoint/zones', {
      cache: 'no-store', // Zorgt ervoor dat data altijd vers is
      // next: { revalidate: 60 }, // Alternatief: Cache data voor 60 seconden
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch zones: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching zones:', error);
    throw error;
  }
}

// Functie voor het ophalen van één specifieke zone
export async function getZoneById(id: string): Promise<Zone> {
  try {
    const response = await fetch(`http://your-api-endpoint/zones/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch zone: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching zone with ID ${id}:`, error);
    throw error;
  }
}

// Eventueel andere server-side functies voor zones
// Deze worden alleen op de server uitgevoerd, niet in de client