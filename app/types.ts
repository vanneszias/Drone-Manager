import { DateRange } from 'react-day-picker';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  length: number;
}

export interface Drone {
  id: number;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'OFFLINE';
  batterij: number; // Battery level
  magOpstijgen: boolean; // Allowed to take off
}

// Add other types as needed (Event, Zone, etc.)
// Renamed from Evenement and using camelCase fields
export interface Event {
  id: number;
  naam: string;
  start_datum: string; // Store as YYYY-MM-DD string
  eind_datum: string;  // Store as YYYY-MM-DD string
  start_tijd: string;  // Store as HH:MM or HH:MM:SS string
  tijdsduur: string; // Store as HH:MM or HH:MM:SS string
}