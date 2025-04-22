export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
                    <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                            Welcome to DroneMaster
                        </h1>
                        <div className="flex flex-col py-12 sm:flex-row gap-4">
                            <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                Monitor, manage, and optimize your drone operations with our comprehensive platform. Real-time tracking, maintenance alerts, and flight analytics all in one place.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}