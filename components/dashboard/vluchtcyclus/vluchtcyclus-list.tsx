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
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Play,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import useVluchtCyclus from "@/hooks/useVluchtCyclus";
import { AttachVerslagDialog } from "./attach-verslag-dialog";

interface VluchtCyclusListProps {
  vluchtCycli: VluchtCyclus[];
}

export default function VluchtCyclusList({
  vluchtCycli,
}: VluchtCyclusListProps) {
  const {
    handleDelete,
    handleUpdateStatus,
    getDrones,
    getZones,
    getPlaces,
    getVerslagen,
  } = useVluchtCyclus;

  const [selectedVluchtCyclus, setSelectedVluchtCyclus] =
    useState<VluchtCyclus | null>(null);
  const [isAttachVerslagOpen, setIsAttachVerslagOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        setError("Failed to load data");
      }
    };

    loadRelatedData();
  }, []);

  const handleAttachVerslag = (vluchtCyclus: VluchtCyclus) => {
    setSelectedVluchtCyclus(vluchtCyclus);
    setIsAttachVerslagOpen(true);
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

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-500 text-white",
      IN_PROGRESS: "bg-blue-500 text-white",
      COMPLETED: "bg-green-500 text-white",
      CANCELLED: "bg-red-500 text-white",
    };
    return (
      <Badge className={styles[status as keyof typeof styles]}>{status}</Badge>
    );
  };

  const getTimeDisplay = (time: string | null | undefined) => {
    if (!time) return "-";
    const date = new Date(time);
    return date.toLocaleString("nl-BE", {
      dateStyle: "short",
      timeStyle: "short",
    });
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
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Drone</TableHead>
            <TableHead>Zone</TableHead>
            <TableHead>Startplaats</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>Eind</TableHead>
            <TableHead>Verslag</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vluchtCycli.map((vluchtCyclus) => (
            <TableRow key={vluchtCyclus.Id}>
              <TableCell>{vluchtCyclus.Id}</TableCell>
              <TableCell>{getStatusBadge(vluchtCyclus.status)}</TableCell>
              <TableCell>{getDroneDetails(vluchtCyclus.DroneId)}</TableCell>
              <TableCell>{getZoneDetails(vluchtCyclus.ZoneId)}</TableCell>
              <TableCell>
                {getStartplaatsDetails(vluchtCyclus.PlaatsId)}
              </TableCell>
              <TableCell>{getTimeDisplay(vluchtCyclus.startTijd)}</TableCell>
              <TableCell>{getTimeDisplay(vluchtCyclus.eindTijd)}</TableCell>
              <TableCell>{getVerslagDetails(vluchtCyclus.VerslagId)}</TableCell>
              <TableCell className="text-right">
                {vluchtCyclus.status === "PENDING" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2"
                    onClick={() =>
                      handleUpdateStatus(
                        vluchtCyclus.Id,
                        "IN_PROGRESS",
                        setError
                      )
                    }
                  >
                    <Play className="h-4 w-4 text-blue-500" />
                    <span className="sr-only">Start vlucht</span>
                  </Button>
                )}
                {vluchtCyclus.status === "IN_PROGRESS" && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2"
                      onClick={() =>
                        handleUpdateStatus(
                          vluchtCyclus.Id,
                          "COMPLETED",
                          setError
                        )
                      }
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="sr-only">Voltooi vlucht</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2"
                      onClick={() =>
                        handleUpdateStatus(
                          vluchtCyclus.Id,
                          "CANCELLED",
                          setError
                        )
                      }
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Annuleer vlucht</span>
                    </Button>
                  </>
                )}
                {vluchtCyclus.status === "COMPLETED" &&
                  !vluchtCyclus.VerslagId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2"
                      onClick={() => handleAttachVerslag(vluchtCyclus)}
                    >
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">Voeg verslag toe</span>
                    </Button>
                  )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(vluchtCyclus.Id)}
                  disabled={vluchtCyclus.status === "IN_PROGRESS"}
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
            <TableCell colSpan={8}>Totaal Vlucht Cycli</TableCell>
            <TableCell className="text-right">{vluchtCycli.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">{error}</div>
      )}

      {selectedVluchtCyclus && (
        <AttachVerslagDialog
          vluchtCyclus={selectedVluchtCyclus}
          isOpen={isAttachVerslagOpen}
          setIsOpen={setIsAttachVerslagOpen}
        />
      )}
    </>
  );
}
