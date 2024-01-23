/*
  Warnings:

  - You are about to drop the `Org` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `orgname` on the `Races` table. All the data in the column will be lost.
  - You are about to drop the column `DOB` on the `UserRunx` table. All the data in the column will be lost.
  - Added the required column `event_id` to the `Races` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Org_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Org";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Organization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Organization_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "startPeriod" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "endPeriod" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "cover_img" TEXT,
    "location" TEXT NOT NULL,
    "logo_img" TEXT,
    "Organization_id" INTEGER NOT NULL,
    CONSTRAINT "Events_Organization_id_fkey" FOREIGN KEY ("Organization_id") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RaceRunner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entryTime" TEXT NOT NULL,
    "raceId" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "nation" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "irunId" INTEGER NOT NULL DEFAULT 0,
    "rank_race" TEXT,
    CONSTRAINT "RaceRunner_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Races" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Races" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "event_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Races_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Races" ("id", "name") SELECT "id", "name" FROM "Races";
DROP TABLE "Races";
ALTER TABLE "new_Races" RENAME TO "Races";
CREATE TABLE "new_UserRunx" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "birth_date" DATETIME,
    "gender" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "id_or_passport" TEXT,
    "nationality" TEXT,
    "policy_agreement" BOOLEAN
);
INSERT INTO "new_UserRunx" ("email", "firstname", "gender", "id", "id_or_passport", "lastname", "nationality", "password", "policy_agreement") SELECT "email", "firstname", "gender", "id", "id_or_passport", "lastname", "nationality", "password", "policy_agreement" FROM "UserRunx";
DROP TABLE "UserRunx";
ALTER TABLE "new_UserRunx" RENAME TO "UserRunx";
CREATE UNIQUE INDEX "UserRunx_email_key" ON "UserRunx"("email");
CREATE UNIQUE INDEX "UserRunx_password_key" ON "UserRunx"("password");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_Organization_name_key" ON "Organization"("Organization_name");
