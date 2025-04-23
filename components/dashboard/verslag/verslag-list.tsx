"use client";

import { Verslag } from "@/app/types";

interface VerslagListProps {
  verslagen: Verslag[];
}

export function VerslagList({ verslagen }: VerslagListProps) {
  return (
    <div className="space-y-4">
      {verslagen.map((verslag) => (
        <div key={verslag.id} className="border rounded-lg p-4">
          <h3 className="font-semibold">{verslag.onderwerp}</h3>
          <p className="text-gray-600">{verslag.beschrijving}</p>
          <div className="mt-2 text-sm text-gray-500">
            <span>Drone ID: {verslag.droneId}</span>
            <span className="ml-4">
              Status: {verslag.isverzonden ? "Verzonden" : "Niet verzonden"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}