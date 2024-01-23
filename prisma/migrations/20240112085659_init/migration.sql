-- CreateTable
CREATE TABLE "Org" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Races" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orgId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Races_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Org_name_key" ON "Org"("name");
