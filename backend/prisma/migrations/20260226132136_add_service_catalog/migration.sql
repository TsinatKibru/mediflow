-- AlterTable
ALTER TABLE "Payments" ADD COLUMN     "labOrderId" TEXT,
ADD COLUMN     "pharmacyOrderId" TEXT;

-- CreateTable
CREATE TABLE "ServiceCatalog" (
    "id" TEXT NOT NULL,
    "category" "ServiceType" NOT NULL DEFAULT 'OTHER',
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCatalog_name_category_tenantId_key" ON "ServiceCatalog"("name", "category", "tenantId");

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_labOrderId_fkey" FOREIGN KEY ("labOrderId") REFERENCES "LabOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_pharmacyOrderId_fkey" FOREIGN KEY ("pharmacyOrderId") REFERENCES "PharmacyOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCatalog" ADD CONSTRAINT "ServiceCatalog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
