-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'ETB',
ADD COLUMN     "currencySymbol" TEXT NOT NULL DEFAULT 'ETB';
