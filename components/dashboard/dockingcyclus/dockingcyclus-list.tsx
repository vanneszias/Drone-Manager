"use client";

import React from 'react';
import { DockingCyclus } from '@/app/types';

type DockingCyclusListProps = {
  dockingCycli: DockingCyclus[];
};

export default function DockingCyclusList({ dockingCycli }: DockingCyclusListProps) {
  if (!dockingCycli || dockingCycli.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <p>No docking cycli available.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Location</th>
            <th className="px-4 py-2 border-b">Capacity</th>
            <th className="px-4 py-2 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {dockingCycli.map((cyclus) => (
            <tr key={cyclus.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b">{cyclus.locatie}</td>
              <td className="px-4 py-2 border-b">{cyclus.capaciteit}</td>
              <td className="px-4 py-2 border-b">{cyclus.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}