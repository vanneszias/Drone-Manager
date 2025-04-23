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
export interface Evenement {
  Id: number;
  StartDatum: string; // Dates are strings in JSON
  EindDatum: string;
  StartTijd: string;  // Times are strings in JSON
  Tijdsduur: string;
  Naam: string;
}

export interface Zone {
  Id: string;         
  name: string;       
  type: 'RESTRICTED' | 'NO_FLY' | 'LANDING' | 'OPERATIONAL';  // Type zone
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
}

export interface Event {
  id: number;
  naam: string;
  start_datum: string; // Store as YYYY-MM-DD string
  eind_datum: string;  // Store as YYYY-MM-DD string
  start_tijd: string;  // Store as HH:MM or HH:MM:SS string
  tijdsduur: string; // Store as HH:MM or HH:MM:SS string
}

export interface Verslag {
  id: number;
  onderwerp: string;
  beschrijving: string;
  isverzonden: boolean;
  droneId: number;
}