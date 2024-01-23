/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserRunx" (
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

-- CreateIndex
CREATE UNIQUE INDEX "UserRunx_email_key" ON "UserRunx"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserRunx_password_key" ON "UserRunx"("password");
