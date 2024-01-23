/*
  Warnings:

  - You are about to drop the column `id_or_passport` on the `UserRunx` table. All the data in the column will be lost.
  - Made the column `policy_agreement` on table `UserRunx` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserRunx" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "birth_date" DATETIME,
    "gender" TEXT,
    "email" TEXT NOT NULL,
    "address" TEXT,
    "password" TEXT NOT NULL,
    "nationalid_or_passport" TEXT,
    "contact" TEXT,
    "emergency_contact" TEXT,
    "medical_information" TEXT,
    "nationality" TEXT,
    "policy_agreement" BOOLEAN NOT NULL,
    "telephone" TEXT,
    "country" TEXT
);
INSERT INTO "new_UserRunx" ("birth_date", "country", "email", "firstname", "gender", "id", "lastname", "nationality", "password", "policy_agreement", "telephone") SELECT "birth_date", "country", "email", "firstname", "gender", "id", "lastname", "nationality", "password", "policy_agreement", "telephone" FROM "UserRunx";
DROP TABLE "UserRunx";
ALTER TABLE "new_UserRunx" RENAME TO "UserRunx";
CREATE UNIQUE INDEX "UserRunx_email_key" ON "UserRunx"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
