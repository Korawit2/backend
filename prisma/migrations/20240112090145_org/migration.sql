/*
  Warnings:

  - You are about to drop the column `orgId` on the `Races` table. All the data in the column will be lost.
  - Added the required column `orgname` to the `Races` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Races" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orgname" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Races_orgname_fkey" FOREIGN KEY ("orgname") REFERENCES "Org" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Races" ("id", "name") SELECT "id", "name" FROM "Races";
DROP TABLE "Races";
ALTER TABLE "new_Races" RENAME TO "Races";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
