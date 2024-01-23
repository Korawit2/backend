/*
  Warnings:

  - You are about to drop the column `username` on the `UserRunx` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserRunx" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "DOB" DATETIME,
    "gender" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "id_or_passport" TEXT,
    "nationality" TEXT,
    "policy_agreement" BOOLEAN
);
INSERT INTO "new_UserRunx" ("DOB", "email", "firstname", "gender", "id", "id_or_passport", "lastname", "nationality", "password", "policy_agreement") SELECT "DOB", "email", "firstname", "gender", "id", "id_or_passport", "lastname", "nationality", "password", "policy_agreement" FROM "UserRunx";
DROP TABLE "UserRunx";
ALTER TABLE "new_UserRunx" RENAME TO "UserRunx";
CREATE UNIQUE INDEX "UserRunx_email_key" ON "UserRunx"("email");
CREATE UNIQUE INDEX "UserRunx_password_key" ON "UserRunx"("password");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
