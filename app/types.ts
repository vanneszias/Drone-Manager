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
  type: 'RESTRICTED' | 'NO_FLY' | 'LANDING' | 'OPERATIONAL';
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
}

// Define and export the Docking type
export interface Docking {
  id: number;
  naam: string;
  locatie: string;
}

export interface Event {
  Id: number;
  Naam: string;
  StartDatum: string;
  EindDatum: string;
  StartTijd: string;
  Tijdsduur: string;
}

export interface Verslag {
  Id: number;
  onderwerp: string;
  inhoud: string;
  isverzonden: boolean;
  isgeaccepteerd: boolean;
  VluchtCyclusId?: number | null;
}

export interface VluchtCyclus {
  Id: number;
  VerslagId?: number | null;
  PlaatsId?: number | null;
  DroneId?: number | null;
  ZoneId?: number | null;
}