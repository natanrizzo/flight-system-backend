-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "fullAddress" TEXT NOT NULL,
    "phoneNumbers" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "workplace" TEXT,
    "workAddress" TEXT,
    "dateOfBirth" DATETIME NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "rgIssuanceDate" DATETIME NOT NULL,
    "rgIssuingAgency" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PASSENGER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL,
    "mobilePhone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Airport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FlightType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "AircraftType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "model" TEXT NOT NULL,
    "description" TEXT,
    "seatCapacity" INTEGER NOT NULL,
    "seatMap" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "Aircraft" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "registrationNumber" TEXT NOT NULL,
    "aircraftTypeId" INTEGER NOT NULL,
    CONSTRAINT "Aircraft_aircraftTypeId_fkey" FOREIGN KEY ("aircraftTypeId") REFERENCES "AircraftType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Flight" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "flightNumber" TEXT NOT NULL,
    "departureDateTime" DATETIME NOT NULL,
    "arrivalDateTime" DATETIME NOT NULL,
    "estimatedDurationMinutes" INTEGER NOT NULL,
    "flightTypeId" INTEGER NOT NULL,
    "aircraftId" INTEGER NOT NULL,
    "originAirportId" INTEGER NOT NULL,
    "destinationAirportId" INTEGER NOT NULL,
    CONSTRAINT "Flight_flightTypeId_fkey" FOREIGN KEY ("flightTypeId") REFERENCES "FlightType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Flight_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Flight_originAirportId_fkey" FOREIGN KEY ("originAirportId") REFERENCES "Airport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Flight_destinationAirportId_fkey" FOREIGN KEY ("destinationAirportId") REFERENCES "Airport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Stopover" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "flightId" INTEGER NOT NULL,
    "airportId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "arrivalDateTime" DATETIME NOT NULL,
    "departureDateTime" DATETIME NOT NULL,
    CONSTRAINT "Stopover_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Stopover_airportId_fkey" FOREIGN KEY ("airportId") REFERENCES "Airport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FlightCrew" (
    "flightId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,

    PRIMARY KEY ("flightId", "employeeId"),
    CONSTRAINT "FlightCrew_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FlightCrew_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reservationNumber" TEXT NOT NULL,
    "bookingDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalPrice" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "userId" INTEGER NOT NULL,
    "flightId" INTEGER NOT NULL,
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "passengerName" TEXT NOT NULL,
    "seatNumber" TEXT NOT NULL,
    "reservationId" INTEGER NOT NULL,
    CONSTRAINT "Ticket_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reservationId" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "processedAt" DATETIME,
    "cardType" TEXT,
    "cardLastFourDigits" TEXT,
    "cardExpiryDate" TEXT,
    "slipExpiryDate" DATETIME,
    "slipBarcode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FlightType_code_key" ON "FlightType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AircraftType_model_key" ON "AircraftType"("model");

-- CreateIndex
CREATE UNIQUE INDEX "Aircraft_registrationNumber_key" ON "Aircraft"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Flight_flightNumber_key" ON "Flight"("flightNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Stopover_flightId_airportId_key" ON "Stopover"("flightId", "airportId");

-- CreateIndex
CREATE UNIQUE INDEX "Stopover_flightId_order_key" ON "Stopover"("flightId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_reservationNumber_key" ON "Reservation"("reservationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reservationId_key" ON "Payment"("reservationId");
