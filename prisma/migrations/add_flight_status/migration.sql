-- AlterTable
-- Since SQLite doesn't support enums natively, FlightStatus is stored as TEXT
-- Note: In SQLite, adding a column with NOT NULL and DEFAULT works for existing rows
ALTER TABLE "Flight" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'ACTIVE';

