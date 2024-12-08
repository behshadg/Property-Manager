import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$connect()
    
    // Create tables
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Property" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "address" TEXT NOT NULL,
        "propertyType" TEXT NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        "bedrooms" INTEGER NOT NULL,
        "bathrooms" DOUBLE PRECISION NOT NULL,
        "size" DOUBLE PRECISION NOT NULL,
        "images" TEXT[],
        "features" TEXT[],
        "status" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
      );
    `
    
    console.log('Database setup complete')
  } catch (error) {
    console.error('Error setting up database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
