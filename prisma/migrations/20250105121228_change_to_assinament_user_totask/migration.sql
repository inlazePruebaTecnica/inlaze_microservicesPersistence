-- CreateTable
CREATE TABLE "AssignedTask" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,
    CONSTRAINT "AssignedTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssignedTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "AssignedTask_taskId_idx" ON "AssignedTask"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignedTask_userId_taskId_key" ON "AssignedTask"("userId", "taskId");
