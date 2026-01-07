
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting migration for PropertyInquiry table...');

    try {
        // 1. Create Enum
        console.log('Creating InquiryStatus enum...');
        await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
          CREATE TYPE "InquiryStatus" AS ENUM ('PENDING', 'CONTACTED', 'CLOSED');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `);

        // 2. Create Table
        console.log('Creating PropertyInquiry table...');
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PropertyInquiry" (
          "id" TEXT NOT NULL,
          "propertyId" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "phone" TEXT NOT NULL,
          "message" TEXT NOT NULL,
          "status" "InquiryStatus" NOT NULL DEFAULT 'PENDING',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
      
          CONSTRAINT "PropertyInquiry_pkey" PRIMARY KEY ("id")
      );
    `);

        // 3. Create Indexes
        console.log('Creating indexes...');
        await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "PropertyInquiry_propertyId_idx" ON "PropertyInquiry"("propertyId");
    `);

        await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "PropertyInquiry_status_idx" ON "PropertyInquiry"("status");
    `);

        // 4. Create Foreign Key
        console.log('Creating foreign key...');
        await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
          ALTER TABLE "PropertyInquiry" 
          ADD CONSTRAINT "PropertyInquiry_propertyId_fkey" 
          FOREIGN KEY ("propertyId") 
          REFERENCES "Property"("id") 
          ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `);

        console.log('✅ Migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
