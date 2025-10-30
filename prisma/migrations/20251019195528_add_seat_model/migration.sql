-- CreateTable
CREATE TABLE "Seat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "flightId" INTEGER NOT NULL,
    "seatNumber" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Seat_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Seat_flightId_seatNumber_key" ON "Seat"("flightId", "seatNumber");
