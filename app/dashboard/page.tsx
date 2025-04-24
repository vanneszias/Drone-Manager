import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Dashboard Overzicht</CardTitle>
              <CardDescription>
                Welkom bij het drone management systeem
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Snel Navigatie</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/dashboard/drones"
                      className="text-primary hover:underline"
                    >
                      Drone Beheer
                    </a>
                  </li>
                  <li>
                    <a
                      href="/dashboard/event"
                      className="text-primary hover:underline"
                    >
                      Evenementen
                    </a>
                  </li>
                  <li>
                    <a
                      href="/dashboard/zones"
                      className="text-primary hover:underline"
                    >
                      Zone Beheer
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vluchten</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/dashboard/vluchtcyclus"
                      className="text-primary hover:underline"
                    >
                      Vlucht Cycli
                    </a>
                  </li>
                  <li>
                    <a
                      href="/dashboard/cyclus"
                      className="text-primary hover:underline"
                    >
                      Cyclus Planning
                    </a>
                  </li>
                  <li>
                    <a
                      href="/dashboard/verslag"
                      className="text-primary hover:underline"
                    >
                      Vluchtverslagen
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Docking</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/dashboard/dockings"
                      className="text-primary hover:underline"
                    >
                      Docking Platformen
                    </a>
                  </li>
                  <li>
                    <a
                      href="/dashboard/dockingcyclus"
                      className="text-primary hover:underline"
                    >
                      Docking Cycli
                    </a>
                  </li>
                  <li>
                    <a
                      href="/dashboard/startplaats"
                      className="text-primary hover:underline"
                    >
                      Startplaatsen
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
