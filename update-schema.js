// One-time script to update the database schema
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Create the TarotReading table using prisma.$queryRaw
    await prisma.$queryRaw`
      CREATE TABLE IF NOT EXISTS "TarotReading" (
        "id" SERIAL NOT NULL,
        "name" TEXT NOT NULL,
        "spreadType" TEXT NOT NULL,
        "cards" JSONB NOT NULL,
        "question" TEXT,
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "userId" INTEGER,
        CONSTRAINT "TarotReading_pkey" PRIMARY KEY ("id")
      );
    `;

    // Add foreign key relationship
    await prisma.$queryRaw`
      ALTER TABLE "TarotReading" 
      ADD CONSTRAINT "TarotReading_userId_fkey" 
      FOREIGN KEY ("userId") 
      REFERENCES "User"("id") 
      ON DELETE SET NULL 
      ON UPDATE CASCADE;
    `;

    console.log('Schema updated successfully!');
  } catch (error) {
    console.error('Error updating schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();