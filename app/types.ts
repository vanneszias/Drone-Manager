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
  Id: number;
  breedte: number;
  lengte: number;
  naam: string;
  EvenementId: number;
}

export interface Startplaats {
  id: number;
  locatie: string;
  isbeschikbaar: boolean; // DB uses snake_case
}

export interface DockingCyclus {
  id: number;
  locatie: string;
  capaciteit: number;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'OFFLINE';
}

// Define and export the Docking type
export interface Docking {
  id: number;
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
  VerslagId?: number | null | undefined;
  PlaatsId?: number | null | undefined;
  DroneId?: number | null | undefined;
  ZoneId?: number | null | undefined;
}

export interface Cyclus {
  Id: number;
  startuur: string; // time string 'HH:MM:SS'
  tijdstip: string; // time string 'HH:MM:SS'
  VluchtCyclusId?: number | null;
}

export interface DockingCyclus {
  Id: number;
  DroneId: number;
  DockingId: number;
  CyclusId: number;
}

export interface Event {
  Id: number;
  Naam: string;
  StartDatum: string;
  EindDatum: string;
  StartTijd: string;
  Tijdsduur: string;
}