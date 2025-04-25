"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Globe, Shield, Battery, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Features() {
  return (
    <section
      id="features"
      className="relative w-full py-12 md:py-24 lg:py-32 bg-black"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0 animate-gradient-xy">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-green-500 to-sky-400 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 via-pink-500 to-red-500 opacity-20 mix-blend-overlay" />
      </div>

      {/* Floating shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-green-500/20 rounded-full blur-xl animate-float-delay" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-white/20 px-3 py-1 text-sm text-white">
              Powerful Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl text-white">
              Everything You Need to Manage Your Drones
            </h2>
            <p className="max-w-[900px] text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform provides comprehensive tools for monitoring,
              managing, and optimizing your drone operations.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {/* Card 1: Real-Time Tracking */}
          <Card className="transition-all hover:shadow-2xl hover:scale-105 duration-300 bg-black/40 backdrop-blur-sm border border-white/20 text-white">
            <CardHeader>
              <div className="p-3 rounded-xl w-fit bg-green-500/20 backdrop-blur-sm animate-float">
                <Globe className="h-5 w-5 text-green-500" />
              </div>
              <CardTitle className="mt-4">Real-Time Tracking</CardTitle>
              <CardDescription className="text-white/70">
                Monitor your entire drone fleet in real-time with precise GPS
                tracking.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="ghost"
                className="gap-1 p-0 hover:bg-transparent hover:underline hover:scale-105 transition-all duration-300 text-green-400"
                onClick={() =>
                  (window.location.href =
                    "https://shattereddisk.github.io/rickroll/rickroll.mp4")
                }
              >
                Learn more <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Card 2: Maintenance Alerts */}
          <Card className="transition-all hover:shadow-2xl hover:scale-105 duration-300 bg-black/40 backdrop-blur-sm border border-white/20 text-white">
            <CardHeader>
              <div className="p-3 rounded-xl w-fit bg-blue-700/20 backdrop-blur-sm animate-float-delay">
                <Shield className="h-5 w-5 text-blue-500" />
              </div>
              <CardTitle className="mt-4">Maintenance Alerts</CardTitle>
              <CardDescription className="text-white/70">
                Get notified about maintenance requirements before issues arise.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="ghost"
                className="gap-1 p-0 hover:bg-transparent hover:underline hover:scale-105 transition-all duration-300 text-blue-400"
                onClick={() =>
                  (window.location.href =
                    "https://shattereddisk.github.io/rickroll/rickroll.mp4")
                }
              >
                Learn more <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Card 3: Battery Management */}
          <Card className="transition-all hover:shadow-2xl hover:scale-105 duration-300 bg-black/40 backdrop-blur-sm border border-white/20 text-white">
            <CardHeader>
              <div className="p-3 rounded-xl w-fit bg-sky-300/20 backdrop-blur-sm animate-float">
                <Battery className="h-5 w-5 text-sky-300" />
              </div>
              <CardTitle className="mt-4">Battery Management</CardTitle>
              <CardDescription className="text-white/70">
                Track battery health and optimize charging cycles for longer
                life.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="ghost"
                className="gap-1 p-0 hover:bg-transparent hover:underline hover:scale-105 transition-all duration-300 text-sky-300"
                onClick={() =>
                  (window.location.href =
                    "https://shattereddisk.github.io/rickroll/rickroll.mp4")
                }
              >
                Learn more <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Card 4: Flight Planning */}
          <Card className="transition-all hover:shadow-2xl hover:scale-105 duration-300 bg-black/40 backdrop-blur-sm border border-white/20 text-white">
            <CardHeader>
              <div className="p-3 rounded-xl w-fit bg-green-500/20 backdrop-blur-sm animate-float-delay">
                <MapPin className="h-5 w-5 text-green-500" />
              </div>
              <CardTitle className="mt-4">Flight Planning</CardTitle>
              <CardDescription className="text-white/70">
                Plan and optimize flight paths with our intuitive mapping tools.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="ghost"
                className="gap-1 p-0 hover:bg-transparent hover:underline hover:scale-105 transition-all duration-300 text-green-400"
                onClick={() =>
                  (window.location.href =
                    "https://shattereddisk.github.io/rickroll/rickroll.mp4")
                }
              >
                Learn more <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Card 5: Analytics Dashboard */}
          <Card className="transition-all hover:shadow-2xl hover:scale-105 duration-300 bg-black/40 backdrop-blur-sm border border-white/20 text-white">
            <CardHeader>
              <div className="p-3 rounded-xl w-fit bg-blue-700/20 backdrop-blur-sm animate-float">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-500"
                >
                  <path d="M3 3v18h18"></path>
                  <path d="m19 9-5 5-4-4-3 3"></path>
                </svg>
              </div>
              <CardTitle className="mt-4">Analytics Dashboard</CardTitle>
              <CardDescription className="text-white/70">
                Make data-driven decisions with comprehensive flight analytics.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="ghost"
                className="gap-1 p-0 hover:bg-transparent hover:underline hover:scale-105 transition-all duration-300 text-blue-400"
                onClick={() =>
                  (window.location.href =
                    "https://shattereddisk.github.io/rickroll/rickroll.mp4")
                }
              >
                Learn more <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Card 6: Team Collaboration */}
          <Card className="transition-all hover:shadow-2xl hover:scale-105 duration-300 bg-black/40 backdrop-blur-sm border border-white/20 text-white">
            <CardHeader>
              <div className="p-3 rounded-xl w-fit bg-sky-300/20 backdrop-blur-sm animate-float-delay">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-sky-300"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M9 17c2 0 2.8-1 2.8-2.8V10c0-2-1-2.8-2.8-2.8"></path>
                  <path d="M15 17c2 0 2.8-1 2.8-2.8V10c0-2-1-2.8-2.8-2.8"></path>
                </svg>
              </div>
              <CardTitle className="mt-4">Team Collaboration</CardTitle>
              <CardDescription className="text-white/70">
                Seamlessly collaborate with your team and share mission data.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="ghost"
                className="gap-1 p-0 hover:bg-transparent hover:underline hover:scale-105 transition-all duration-300 text-sky-300"
                onClick={() =>
                  (window.location.href =
                    "https://shattereddisk.github.io/rickroll/rickroll.mp4")
                }
              >
                Learn more <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
