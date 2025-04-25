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
    <div className="space-y-8">
      <Card className="card-base bg-opacity-50 backdrop-blur-sm bg-white/30">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl bg-clip-text text-transparent theme-gradient-2">
                Dashboard Overview
              </CardTitle>
              <CardDescription className="text-white/70">
                Welcome to the drone management system
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="card-interactive bg-opacity-40 backdrop-blur-sm bg-white/20">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white">
                  Quick Navigation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/dashboard/drones"
                      className="nav-link inline-block"
                    >
                      Drone Management
                    </a>
                  </li>
                  <li>
                    <a
                      href="/dashboard/event"
                      className="nav-link inline-block"
                    >
                      Events
                    </a>
                  </li>
                  <li>
                    <a
                      href="/dashboard/zones"
                      className="nav-link inline-block"
                    >
                      Zone Management
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-interactive bg-opacity-40 backdrop-blur-sm bg-white/20">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white">Flights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/dashboard/vluchtcyclus"
                      className="nav-link inline-block"
                    >
                      Flight Cycles
                    </a>
                  </li>
                  <li>
                    <a
                      href="/dashboard/cyclus"
                      className="nav-link inline-block"
                    >
                      Cycle Planning
                    </a>
                  </li>
                  <li>
                    <a
                      href="/dashboard/verslag"
                      className="nav-link inline-block"
                    >
                      Flight Reports
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-interactive bg-opacity-40 backdrop-blur-sm bg-white/20">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white">Docking</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/dashboard/dockings"
                      className="nav-link inline-block"
                    >
                      Docking Platforms
                    </a>
                  </li>
                  <li>
                    <a
                      href="/dashboard/dockingcyclus"
                      className="nav-link inline-block"
                    >
                      Docking Cycles
                    </a>
                  </li>
                  <li>
                    <a
                      href="/dashboard/startplaats"
                      className="nav-link inline-block"
                    >
                      Start Locations
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
