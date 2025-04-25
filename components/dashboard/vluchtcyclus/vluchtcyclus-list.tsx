"use client";

import React, { useState, useEffect } from "react";
import { VluchtCyclus, Drone, Zone, Startplaats, Verslag } from "@/app/types";
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
import useVluchtCyclus from "@/hooks/useVluchtCyclus";
import { EditVluchtCyclusDialog } from "./edit-vluchtcyclus-dialog";

interface VluchtCyclusListProps {
  vluchtCycli: VluchtCyclus[];
}

export default function VluchtCyclusList({
  vluchtCycli,
}: VluchtCyclusListProps) {
  const { handleDelete, getDrones, getZones, getPlaces, getVerslagen } =
    useVluchtCyclus;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedVluchtCyclus, setSelectedVluchtCyclus] =
    useState<VluchtCyclus | null>(null);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [places, setPlaces] = useState<Startplaats[]>([]);
  const [verslagen, setVerslagen] = useState<Verslag[]>([]);

  useEffect(() => {
    const loadRelatedData = async () => {
      try {
        const [dronesData, zonesData, placesData, verslagenData] =
          await Promise.all([
            getDrones(),
            getZones(),
            getPlaces(),
            getVerslagen(),
          ]);
        setDrones(dronesData);
        setZones(zonesData);
        setPlaces(placesData);
        setVerslagen(verslagenData);
      } catch (error) {
        console.error("Error loading related data:", error);
      }
    };

    loadRelatedData();
  }, []);

  const handleEdit = (vluchtCyclus: VluchtCyclus) => {
    setSelectedVluchtCyclus(vluchtCyclus);
    setIsEditOpen(true);
  };

  const getDroneDetails = (droneId: number | null | undefined) => {
    if (!droneId) return "Geen drone";
    const drone = drones.find((d) => d.Id === droneId);
    if (!drone) return `Drone ${droneId}`;
    return `Drone ${droneId} (${drone.status}, ${drone.batterij}%)`;
  };

  const getZoneDetails = (zoneId: number | null | undefined) => {
    if (!zoneId) return "Geen zone";
    const zone = zones.find((z) => z.Id === zoneId);
    if (!zone) return `Zone ${zoneId}`;
    return `${zone.naam} (${zone.breedte}x${zone.lengte}m)`;
  };

  const getStartplaatsDetails = (plaatsId: number | null | undefined) => {
    if (!plaatsId) return "Geen startplaats";
    const plaats = places.find((p) => p.Id === plaatsId);
    if (!plaats) return `Startplaats ${plaatsId}`;
    return `${plaats.locatie} ${
      plaats.isbeschikbaar ? "(Beschikbaar)" : "(Bezet)"
    }`;
  };

  const getVerslagDetails = (verslagId: number | null | undefined) => {
    if (!verslagId) return "Geen verslag";
    const verslag = verslagen.find((v) => v.Id === verslagId);
    if (!verslag) return `Verslag ${verslagId}`;
    return verslag.onderwerp;
  };

  if (!vluchtCycli || vluchtCycli.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <p className="text-muted-foreground">Geen vlucht cycli gevonden.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Klik op 'Nieuwe Vlucht Cyclus' om er een toe te voegen.
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
            <TableHead>Drone</TableHead>
            <TableHead>Zone</TableHead>
            <TableHead>Startplaats</TableHead>
            <TableHead>Verslag</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vluchtCycli.map((vluchtCyclus) => (
            <TableRow key={vluchtCyclus.Id}>
              <TableCell className="font-medium">{vluchtCyclus.Id}</TableCell>
              <TableCell>{getDroneDetails(vluchtCyclus.DroneId)}</TableCell>
              <TableCell>{getZoneDetails(vluchtCyclus.ZoneId)}</TableCell>
              <TableCell>
                {getStartplaatsDetails(vluchtCyclus.PlaatsId)}
              </TableCell>
              <TableCell>{getVerslagDetails(vluchtCyclus.VerslagId)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={() => handleEdit(vluchtCyclus)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Bewerk vlucht cyclus</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(vluchtCyclus.Id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Verwijder vlucht cyclus</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Totaal Vlucht Cycli</TableCell>
            <TableCell className="text-right">{vluchtCycli.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {selectedVluchtCyclus && (
        <EditVluchtCyclusDialog
          vluchtCyclus={selectedVluchtCyclus}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
        />
      )}
    </>
  );
}
