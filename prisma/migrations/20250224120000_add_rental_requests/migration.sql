-- CreateTable
CREATE TABLE "RentalRequest" (
    "id" TEXT NOT NULL,
    "chariot_type" TEXT NOT NULL,
    "motorisation" TEXT NOT NULL,
    "capacite_kg" INTEGER,
    "hauteur_m" DOUBLE PRECISION,
    "ville" TEXT,
    "duree_location" TEXT,
    "type_roues" TEXT,
    "type_mat" TEXT,
    "notes" TEXT,
    "client_name" TEXT NOT NULL,
    "client_phone" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RentalRequest_status_idx" ON "RentalRequest"("status");

-- CreateIndex
CREATE INDEX "RentalRequest_createdAt_idx" ON "RentalRequest"("createdAt");
