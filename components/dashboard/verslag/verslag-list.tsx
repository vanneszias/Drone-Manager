"use client";

import React, { useState, useEffect } from "react";
import { Verslag, VluchtCyclus, Drone, Startplaats, Zone } from "@/app/types";
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
import { Edit, Trash2 } from "lucide-react";
import useVerslag from "@/hooks/useVerslag";
import { EditVerslagDialog } from "./edit-verslag-dialog";

interface VerslagListProps {
  verslagen: Verslag[];
}

export default function VerslagList({ verslagen }: VerslagListProps) {
  const { handleDelete } = useVerslag;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedVerslag, setSelectedVerslag] = useState<Verslag | null>(null);
  const [vluchtCyclusDetails, setVluchtCyclusDetails] = useState<{
    [key: number]: {
      drone?: Drone;
      plaats?: Startplaats;
      zone?: Zone;
    };
  }>({});

  useEffect(() => {
    const fetchVluchtCyclusDetails = async () => {
      try {
        // Get unique VluchtCyclusIds
        const cyclusIds = verslagen
          .map((v) => v.VluchtCyclusId)
          .filter((id): id is number => id != null);

        for (const cyclusId of cyclusIds) {
          const response = await fetch(
            `https://drone.ziasvannes.tech/api/vlucht-cycli/${cyclusId}`
          );
          if (!response.ok) continue;

          const vluchtCyclus: VluchtCyclus = await response.json();

          const details: { drone?: Drone; plaats?: Startplaats; zone?: Zone } =
            {};

          if (vluchtCyclus.DroneId) {
            const droneRes = await fetch(
              `https://drone.ziasvannes.tech/api/drones/${vluchtCyclus.DroneId}`
            );
            if (droneRes.ok) {
              details.drone = await droneRes.json();
            }
          }

          if (vluchtCyclus.PlaatsId) {
            const plaatsRes = await fetch(
              `https://drone.ziasvannes.tech/api/startplaatsen/${vluchtCyclus.PlaatsId}`
            );
            if (plaatsRes.ok) {
              details.plaats = await plaatsRes.json();
            }
          }

          if (vluchtCyclus.ZoneId) {
            const zoneRes = await fetch(
              `https://drone.ziasvannes.tech/api/zones/${vluchtCyclus.ZoneId}`
            );
            if (zoneRes.ok) {
              details.zone = await zoneRes.json();
            }
          }

          setVluchtCyclusDetails((prev) => ({
            ...prev,
            [cyclusId]: details,
          }));
        }
      } catch (error) {
        console.error("Error fetching vluchtcyclus details:", error);
      }
    };

    fetchVluchtCyclusDetails();
  }, [verslagen]);

  const handleEdit = (verslag: Verslag) => {
    setSelectedVerslag(verslag);
    setIsEditOpen(true);
  };

  if (!verslagen || verslagen.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <p className="text-muted-foreground">Geen verslagen gevonden.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Klik op 'Nieuw Verslag' om er een toe te voegen.
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
            <TableHead>Onderwerp</TableHead>
            <TableHead>Inhoud</TableHead>
            <TableHead>Verzonden</TableHead>
            <TableHead>Geaccepteerd</TableHead>
            <TableHead>VluchtCyclus Details</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {verslagen.map((verslag) => (
            <TableRow key={verslag.Id}>
              <TableCell className="font-medium">{verslag.Id}</TableCell>
              <TableCell>{verslag.onderwerp}</TableCell>
              <TableCell>{verslag.inhoud}</TableCell>
              <TableCell>
                <Badge
                  variant={verslag.isverzonden ? "default" : "secondary"}
                  className={
                    verslag.isverzonden
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {verslag.isverzonden ? "Ja" : "Nee"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={verslag.isgeaccepteerd ? "default" : "secondary"}
                  className={
                    verslag.isgeaccepteerd
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {verslag.isgeaccepteerd ? "Ja" : "Nee"}
                </Badge>
              </TableCell>
              <TableCell>
                {verslag.VluchtCyclusId ? (
                  <div className="text-sm">
                    {vluchtCyclusDetails[verslag.VluchtCyclusId]?.drone && (
                      <div className="mb-1">
                        Drone:{" "}
                        {
                          vluchtCyclusDetails[verslag.VluchtCyclusId]?.drone
                            ?.status
                        }
                        (Batterij:{" "}
                        {
                          vluchtCyclusDetails[verslag.VluchtCyclusId]?.drone
                            ?.batterij
                        }
                        %)
                      </div>
                    )}
                    {vluchtCyclusDetails[verslag.VluchtCyclusId]?.plaats && (
                      <div className="mb-1">
                        Startplaats:{" "}
                        {
                          vluchtCyclusDetails[verslag.VluchtCyclusId]?.plaats
                            ?.locatie
                        }
                      </div>
                    )}
                    {vluchtCyclusDetails[verslag.VluchtCyclusId]?.zone && (
                      <div>
                        Zone:{" "}
                        {
                          vluchtCyclusDetails[verslag.VluchtCyclusId]?.zone
                            ?.naam
                        }
                      </div>
                    )}
                  </div>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={() => handleEdit(verslag)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Bewerk verslag</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(verslag.Id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Verwijder verslag</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>Totaal Verslagen</TableCell>
            <TableCell className="text-right">{verslagen.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {selectedVerslag && (
        <EditVerslagDialog
          verslag={selectedVerslag}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
        />
      )}
    </>
  );
}
