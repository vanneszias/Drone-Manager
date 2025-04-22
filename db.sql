-- Create tables for drone flight management system
-- Note: Using Supabase/PostgreSQL syntax

-- Create Evenement (Event) table
CREATE TABLE "Evenement" (
    "Id" SERIAL PRIMARY KEY,
    "StartDatum" DATE NOT NULL,
    "EindDatum" DATE NOT NULL,
    "StartTijd" TIME NOT NULL,
    "Tijdsduur" TIME NOT NULL,
    "Naam" VARCHAR(255) NOT NULL
);

-- Create Zone table with foreign key to Evenement
CREATE TABLE "Zone" (
    "Id" SERIAL PRIMARY KEY,
    "breedte" DOUBLE PRECISION NOT NULL,
    "lengte" DOUBLE PRECISION NOT NULL,
    "naam" VARCHAR(255) NOT NULL,
    "EvenementId" INTEGER NOT NULL REFERENCES "Evenement"("Id") ON DELETE CASCADE
);

-- Create Startplaats (Starting place) table
CREATE TABLE "Startplaats" (
    "Id" SERIAL PRIMARY KEY,
    "locatie" VARCHAR(255) NOT NULL,
    "isbeschikbaar" BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create Verslag (Report) table
CREATE TABLE "Verslag" (
    "Id" SERIAL PRIMARY KEY,
    "onderwerp" VARCHAR(255) NOT NULL,
    "inhoud" TEXT NOT NULL,
    "isverzonden" BOOLEAN NOT NULL DEFAULT FALSE,
    "isgeaccepteerd" BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create Drone table
CREATE TABLE "Drone" (
    "Id" SERIAL PRIMARY KEY,
    "status" VARCHAR(50) NOT NULL CHECK ("status" IN ('AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OFFLINE')),
    "batterij" INTEGER NOT NULL CHECK ("batterij" >= 0 AND "batterij" <= 100),
    "magOpstijgen" BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create Docking table
CREATE TABLE "Docking" (
    "Id" SERIAL PRIMARY KEY,
    "locatie" VARCHAR(255) NOT NULL,
    "isbeschikbaar" BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create Cyclus table
CREATE TABLE "Cyclus" (
    "Id" SERIAL PRIMARY KEY,
    "startuur" TIME NOT NULL,
    "tijdstip" TIME NOT NULL,
    "VluchtCyclusId" INTEGER
);

-- Create VluchtCyclus (Flight Cycle) table with foreign keys
CREATE TABLE "VluchtCyclus" (
    "Id" SERIAL PRIMARY KEY,
    "VerslagId" INTEGER REFERENCES "Verslag"("Id"),
    "PlaatsId" INTEGER REFERENCES "Startplaats"("Id"),
    "DroneId" INTEGER REFERENCES "Drone"("Id"),
    "ZoneId" INTEGER REFERENCES "Zone"("Id")
);

-- Create DockingCyclus table with foreign keys
CREATE TABLE "DockingCyclus" (
    "Id" SERIAL PRIMARY KEY,
    "DroneId" INTEGER REFERENCES "Drone"("Id"),
    "DockingId" INTEGER REFERENCES "Docking"("Id"),
    "CyclusId" INTEGER REFERENCES "Cyclus"("Id")
);

-- Add the foreign key to Cyclus that was waiting for VluchtCyclus to be created
ALTER TABLE "Cyclus" 
ADD CONSTRAINT "fk_cyclus_vluchtcyclus" 
FOREIGN KEY ("VluchtCyclusId") REFERENCES "VluchtCyclus"("Id");

-- Create indexes for better query performance
CREATE INDEX "idx_zone_evenement" ON "Zone"("EvenementId");
CREATE INDEX "idx_vluchtcyclus_verslag" ON "VluchtCyclus"("VerslagId");
CREATE INDEX "idx_vluchtcyclus_plaats" ON "VluchtCyclus"("PlaatsId");
CREATE INDEX "idx_vluchtcyclus_drone" ON "VluchtCyclus"("DroneId");
CREATE INDEX "idx_vluchtcyclus_zone" ON "VluchtCyclus"("ZoneId");
CREATE INDEX "idx_dockingcyclus_drone" ON "DockingCyclus"("DroneId");
CREATE INDEX "idx_dockingcyclus_docking" ON "DockingCyclus"("DockingId");
CREATE INDEX "idx_dockingcyclus_cyclus" ON "DockingCyclus"("CyclusId");
CREATE INDEX "idx_cyclus_vluchtcyclus" ON "Cyclus"("VluchtCyclusId");