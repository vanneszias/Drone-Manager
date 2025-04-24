"use client";

import React, { useState, useEffect } from "react";
import {
  Cyclus,
  VluchtCyclus,
  Drone,
  Zone,
  Startplaats,
  Verslag,
} from "@/app/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import useCyclus from "@/hooks/useCyclus";
import useVluchtCyclus from "@/hooks/useVluchtCyclus";
import { EditCyclusDialog } from "./edit-cyclus-dialog";

interface CyclusListProps {
  cycli: Cyclus[];
}

export default function CyclusList({ cycli }: CyclusListProps) {
  const { handleDelete } = useCyclus;
  const { getVluchtCycli, getDrones, getZones, getPlaces, getVerslagen } =
    useVluchtCyclus;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCyclus, setSelectedCyclus] = useState<Cyclus | null>(null);
  const [vluchtCycli, setVluchtCycli] = useState<VluchtCyclus[]>([]);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [plaatsen, setPlaatsen] = useState<Startplaats[]>([]);
  const [verslagen, setVerslagen] = useState<Verslag[]>([]);

  const handleEdit = (cyclus: Cyclus) => {
    setSelectedCyclus(cyclus);
    setIsEditOpen(true);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [vluchtData, droneData, zoneData, plaatsData, verslagData] =
          await Promise.all([
            getVluchtCycli(),
            getDrones(),
            getZones(),
            getPlaces(),
            getVerslagen(),
          ]);
        setVluchtCycli(vluchtData);
        setDrones(droneData);
        setZones(zoneData);
        setPlaatsen(plaatsData);
        setVerslagen(verslagData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, [cycli]);

  const getVluchtCyclusDetails = (id: number | null | undefined) => {
    if (!id) return "Geen vluchtcyclus";
    const vluchtCyclus = vluchtCycli.find((vc) => vc.Id === Number(id));
    if (!vluchtCyclus) return `Vluchtcyclus ${id} (laden...)`;

    const details = [];

    if (vluchtCyclus.DroneId) {
      const drone = drones.find((d) => d.Id === vluchtCyclus.DroneId);
      details.push(
        `Drone #${vluchtCyclus.DroneId}${drone ? ` (${drone.status})` : ""}`
      );
    }

    if (vluchtCyclus.ZoneId) {
      const zone = zones.find((z) => z.Id === vluchtCyclus.ZoneId);
      details.push(
        `Zone #${vluchtCyclus.ZoneId}${zone ? ` (${zone.naam})` : ""}`
      );
    }

    if (vluchtCyclus.PlaatsId) {
      const plaats = plaatsen.find((p) => p.Id === vluchtCyclus.PlaatsId);
      details.push(
        `Startplaats #${vluchtCyclus.PlaatsId}${
          plaats ? ` (${plaats.locatie})` : ""
        }`
      );
    }

    if (vluchtCyclus.VerslagId) {
      const verslag = verslagen.find((v) => v.Id === vluchtCyclus.VerslagId);
      if (verslag) {
        details.push(`Verslag: ${verslag.onderwerp}`);
      }
    }

    return details.length > 0 ? details.join(" | ") : `Vluchtcyclus #${id}`;
  };

  if (!cycli || cycli.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <p className="text-muted-foreground">Geen cycli gevonden.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Klik op 'Nieuwe Cyclus' om er een toe te voegen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Start Uur</TableHead>
            <TableHead>Tijdstip</TableHead>
            <TableHead>Vluchtcyclus Details</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cycli.map((cyclus) => (
            <TableRow key={cyclus.Id}>
              <TableCell className="font-medium">{cyclus.Id}</TableCell>
              <TableCell>{cyclus.startuur}</TableCell>
              <TableCell>{cyclus.tijdstip}</TableCell>
              <TableCell>
                {getVluchtCyclusDetails(cyclus.vluchtcyclus_id)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={() => handleEdit(cyclus)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Bewerk cyclus</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(cyclus.Id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Verwijder cyclus</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Totaal Cycli</TableCell>
            <TableCell className="text-right">{cycli.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {selectedCyclus && (
        <EditCyclusDialog
          cyclus={selectedCyclus}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
        />
      )}
    </>
  );
}
