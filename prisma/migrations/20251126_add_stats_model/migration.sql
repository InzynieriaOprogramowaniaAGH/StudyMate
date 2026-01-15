-- CreateTable
CREATE TABLE "Stats" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Stats_userId_idx" ON "Stats"("userId");

-- CreateIndex
CREATE INDEX "Stats_createdAt_idx" ON "Stats"("createdAt");

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
