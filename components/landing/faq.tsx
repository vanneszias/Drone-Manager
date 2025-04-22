import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export default function FAQ() {
    return (
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
    )
}