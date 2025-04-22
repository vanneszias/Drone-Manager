"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Shield, MapPin, Battery, Rocket, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center space-x-2">
            <Rocket className="h-6 w-6" />
            <span className="text-xl font-bold">DroneMaster</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-foreground/80">Features</Link>
            <Link href="#testimonials" className="transition-colors hover:text-foreground/80">Testimonials</Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground/80">Pricing</Link>
            <Link href="#faq" className="transition-colors hover:text-foreground/80">FAQ</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="outline">Log In</Button>
            <Button>Sign Up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Drone Management Simplified
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Take Control of Your Drone Fleet
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Monitor, manage, and optimize your drone operations with our comprehensive platform. Real-time tracking, maintenance alerts, and flight analytics all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Request Demo
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-20 blur-xl" />
              <div className="relative bg-muted rounded-lg overflow-hidden border shadow-lg">
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                  {/* This would be your drone dashboard preview image */}
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Dashboard Preview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Powerful Features
              </div>
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

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Transform Your Drone Operations?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of drone operators who have streamlined their operations with our platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Testimonials
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Trusted by Drone Professionals</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Here's what our customers say about our drone management platform.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <Card className="bg-muted/50">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <circle cx="12" cy="8" r="5"></circle>
                      <path d="M20 21a8 8 0 1 0-16 0"></path>
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Sarah Miller</CardTitle>
                    <CardDescription>Aerial Photography</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "This platform has revolutionized how we manage our photography drones. The battery management features alone have saved us countless hours of downtime."
                </p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <circle cx="12" cy="8" r="5"></circle>
                      <path d="M20 21a8 8 0 1 0-16 0"></path>
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-lg">James Thompson</CardTitle>
                    <CardDescription>Agricultural Services</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "Managing a fleet of agricultural drones used to be a nightmare. Now with real-time tracking and maintenance alerts, we've improved efficiency by over 40%."
                </p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <circle cx="12" cy="8" r="5"></circle>
                      <path d="M20 21a8 8 0 1 0-16 0"></path>
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Elena Rodriguez</CardTitle>
                    <CardDescription>Urban Inspection</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "The flight planning tools have been a game-changer for our urban inspection team. We can now plan complex routes around buildings with confidence."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                FAQ
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Frequently Asked Questions</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Common questions about our drone management platform.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl mt-12 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>How does real-time tracking work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our platform connects to your drones via their onboard telemetry systems, providing continuous GPS location data, altitude, speed, and battery status. This information is updated every few seconds to give you accurate real-time monitoring.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Is the platform compatible with all drone models?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We support most major commercial drone manufacturers including DJI, Autel, Parrot, and Skydio. Our platform can be customized to work with specialized industrial drones as well. Contact us for specific compatibility information.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>How secure is the data on your platform?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Security is our top priority. All data is encrypted both in transit and at rest. We use industry-standard security protocols and regularly undergo security audits. Your drone data is protected by enterprise-grade security measures.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Can I integrate with other software systems?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, our platform offers robust API access that allows for integration with many business systems including asset management, ERP, and GIS software. We also provide direct integrations with popular drone mission planning tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-background border-t">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Rocket className="h-6 w-6" />
                <span className="text-xl font-bold">DroneMaster</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Simplifying drone fleet management for businesses and professionals worldwide.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground">Features</Link>
                </li>
                <li>
                  <Link href="#testimonials" className="text-muted-foreground hover:text-foreground">Testimonials</Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link>
                </li>
                <li>
                  <Link href="#faq" className="text-muted-foreground hover:text-foreground">FAQ</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">Blog</Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">Documentation</Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">Support Center</Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">Webinars</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground">hello@dronemaster.com</li>
                <li className="text-muted-foreground">+1 (555) 123-4567</li>
                <li className="text-muted-foreground">123 Drone Street, Tech City</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">© 2025 DroneMaster. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}