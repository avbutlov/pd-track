-- CreateTable
CREATE TABLE "sites" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deviations" (
    "id" SERIAL NOT NULL,
    "deviationNumber" TEXT NOT NULL,
    "siteId" INTEGER NOT NULL,
    "patientId" TEXT NOT NULL,
    "deviationDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" TEXT,
    "severityRationale" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deviations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capas" (
    "id" SERIAL NOT NULL,
    "deviationId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "assignedTo" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "completionNotes" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_classifications" (
    "id" SERIAL NOT NULL,
    "deviationId" INTEGER NOT NULL,
    "severity" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "riskFactors" TEXT[],
    "regulatoryRef" TEXT,
    "modelUsed" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sites_code_key" ON "sites"("code");

-- CreateIndex
CREATE UNIQUE INDEX "deviations_deviationNumber_key" ON "deviations"("deviationNumber");

-- CreateIndex
CREATE INDEX "deviations_siteId_idx" ON "deviations"("siteId");

-- CreateIndex
CREATE INDEX "deviations_category_idx" ON "deviations"("category");

-- CreateIndex
CREATE INDEX "deviations_severity_idx" ON "deviations"("severity");

-- CreateIndex
CREATE INDEX "deviations_status_idx" ON "deviations"("status");

-- CreateIndex
CREATE INDEX "deviations_deviationDate_idx" ON "deviations"("deviationDate");

-- CreateIndex
CREATE INDEX "capas_deviationId_idx" ON "capas"("deviationId");

-- CreateIndex
CREATE INDEX "capas_status_idx" ON "capas"("status");

-- CreateIndex
CREATE INDEX "ai_classifications_deviationId_idx" ON "ai_classifications"("deviationId");

-- AddForeignKey
ALTER TABLE "deviations" ADD CONSTRAINT "deviations_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capas" ADD CONSTRAINT "capas_deviationId_fkey" FOREIGN KEY ("deviationId") REFERENCES "deviations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_classifications" ADD CONSTRAINT "ai_classifications_deviationId_fkey" FOREIGN KEY ("deviationId") REFERENCES "deviations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
