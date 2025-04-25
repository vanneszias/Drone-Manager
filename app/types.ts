export interface User {
  Id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  length: number;
}

export interface Drone {
  Id: number;
  status: "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "OFFLINE";
  batterij: number; // Battery level
  magOpstijgen: boolean; // Allowed to take off
}

// Add other types as needed (Event, Zone, etc.)

export interface Zone {
  Id: number;
  breedte: number;
  lengte: number;
  naam: string;
  EvenementId: number;
}

export interface Startplaats {
  Id: number;
  locatie: string;
  isbeschikbaar: boolean;
}

export interface DockingCyclus {
  Id: number;
  dockingId: number;
  cyclusId: number;
  droneId: number;
}

// Define and export the Docking type
export interface Docking {
  Id: number;
  locatie: string;
  isbeschikbaar: boolean;
}

export interface Event {
  Id: number;
  Naam: string;
  StartDatum: string; // Dates are strings in ISO format (YYYY-MM-DD)
  EindDatum: string;
  StartTijd: string; // Times are strings in ISO format (HH:mm:ss)
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
