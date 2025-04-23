"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Globe, Shield, Battery, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Features() {
  const router = useRouter();
    return (
         <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Powerful Features
              </div>
              <Button size="lg" className="gap-2"
                onClick={() => {
                  router.push("/home")
              }}
              >
                Home Menu
              </Button>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Everything You Need to Manage Your Drones</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform provides comprehensive tools for monitoring, managing, and optimizing your drone operations.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="p-2 rounded-lg bg-primary/10 w-fit">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="mt-4">Real-Time Tracking</CardTitle>
                <CardDescription>Monitor your entire drone fleet in real-time with precise GPS tracking.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" className="gap-1 p-0 hover:bg-transparent hover:underline">
                  Learn more <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="p-2 rounded-lg bg-primary/10 w-fit">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="mt-4">Maintenance Alerts</CardTitle>
                <CardDescription>Get notified about maintenance requirements before issues arise.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" className="gap-1 p-0 hover:bg-transparent hover:underline">
                  Learn more <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="p-2 rounded-lg bg-primary/10 w-fit">
                  <Battery className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="mt-4">Battery Management</CardTitle>
                <CardDescription>Track battery health and optimize charging cycles for longer life.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" className="gap-1 p-0 hover:bg-transparent hover:underline">
                  Learn more <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="p-2 rounded-lg bg-primary/10 w-fit">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="mt-4">Flight Planning</CardTitle>
                <CardDescription>Plan and optimize flight paths with our intuitive mapping tools.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" className="gap-1 p-0 hover:bg-transparent hover:underline">
                  Learn more <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="p-2 rounded-lg bg-primary/10 w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M3 3v18h18"></path>
                    <path d="m19 9-5 5-4-4-3 3"></path>
                  </svg>
                </div>
                <CardTitle className="mt-4">Analytics Dashboard</CardTitle>
                <CardDescription>Make data-driven decisions with comprehensive flight analytics.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" className="gap-1 p-0 hover:bg-transparent hover:underline">
                  Learn more <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="p-2 rounded-lg bg-primary/10 w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <path d="M9 17c2 0 2.8-1 2.8-2.8V10c0-2-1-2.8-2.8-2.8"></path>
                    <path d="M15 17c2 0 2.8-1 2.8-2.8V10c0-2-1-2.8-2.8-2.8"></path>
                  </svg>
                </div>
                <CardTitle className="mt-4">Team Collaboration</CardTitle>
                <CardDescription>Seamlessly collaborate with your team and share mission data.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="ghost" className="gap-1 p-0 hover:bg-transparent hover:underline">
                  Learn more <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

    )
}