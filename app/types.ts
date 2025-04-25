import { DateRange } from "react-day-picker";

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
  batterij: number;
  magOpstijgen: boolean;
}

export interface Evenement {
  Id: number;
  StartDatum: string;
  EindDatum: string;
  StartTijd: string;
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

export interface Docking {
  Id: number;
  locatie: string;
  isbeschikbaar: boolean;
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
  DroneId: number; // Required: must have a drone
  PlaatsId: number; // Required: must have a starting location
  ZoneId?: number | null; // Optional: not all flights need zones
  VerslagId?: number | null; // Optional: report is added after flight
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"; // New: track flight status
  startTijd?: string | null; // New: track when flight started
  eindTijd?: string | null; // New: track when flight ended
}

export interface Cyclus {
  Id: number;
  startuur: string;
  tijdstip: string;
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
