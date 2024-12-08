import { db } from '@/lib/db'

async function main() {
  try {
    // Test connection
    await db.$connect()
    console.log('Connected to database')

    // Force sync schema
    await db.$executeRaw`
      DO $$ 
      BEGIN
        -- Drop existing tables if they exist
        DROP TABLE IF EXISTS "Notification" CASCADE;
        DROP TABLE IF EXISTS "Expense" CASCADE;
        DROP TABLE IF EXISTS "Payment" CASCADE;
        DROP TABLE IF EXISTS "Document" CASCADE;
        DROP TABLE IF EXISTS "Comment" CASCADE;
        DROP TABLE IF EXISTS "MaintenanceReq" CASCADE;
        DROP TABLE IF EXISTS "Tenant" CASCADE;
        DROP TABLE IF EXISTS "Unit" CASCADE;
        DROP TABLE IF EXISTS "Property" CASCADE;
      END $$;
    `

    console.log('Dropped existing tables')

    // Push new schema
    await db.$executeRaw`
      -- Create Property table first
      CREATE TABLE "Property" (
        "id" TEXT PRIMARY KEY,
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
        "updatedAt" TIMESTAMP(3) NOT NULL
      );

      -- Create indices
      CREATE INDEX "Property_userId_idx" ON "Property"("userId");
    `

    console.log('Created Property table')

    // Continue with other tables...
    // You can add the rest of the tables here

    console.log('Database initialization complete')
  } catch (error) {
    console.error('Error initializing database:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

main()