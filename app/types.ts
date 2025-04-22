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
  Id: number;
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