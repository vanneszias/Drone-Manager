import React from "react";

import Hero from "./hero";
import Features from "./features";
import Testimonials from "./testimonials";
import FAQ from "./faq";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <Testimonials />
      <FAQ />
    </div>
  );
}
