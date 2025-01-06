/*
  Warnings:

  - You are about to drop the column `team_id` on the `Task` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dateLimit" DATETIME NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'TODO',
    "user_id" INTEGER,
    "proyectId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_proyectId_fkey" FOREIGN KEY ("proyectId") REFERENCES "Proyect" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("createdAt", "dateLimit", "description", "id", "proyectId", "state", "title", "updatedAt", "user_id") SELECT "createdAt", "dateLimit", "description", "id", "proyectId", "state", "title", "updatedAt", "user_id" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
