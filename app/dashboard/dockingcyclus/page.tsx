"use client";

import React from 'react';
import DockingCyclusList from '@/components/dashboard/dockingcyclus/dockingcyclus-list';
import { AddDockingCyclusDialog } from '@/components/dashboard/dockingcyclus/add-dockingcyclus-dialog';
import useDockingCyclus from '@/hooks/useDockingCyclus';

export default function DockingCyclusPage() {
  const { dockingCyclus, fetchDockingCyclus } = useDockingCyclus();

  React.useEffect(() => {
    fetchDockingCyclus();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Docking Cyclus Management</h1>
        <AddDockingCyclusDialog />
      </div>
      <DockingCyclusList dockingCycli={dockingCyclus} />
    </div>
  );
}