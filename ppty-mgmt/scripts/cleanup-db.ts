import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanup() {
  try {
    await prisma.$connect()
    
    // Drop all tables
    await prisma.$executeRaw`DROP SCHEMA public CASCADE;`
    await prisma.$executeRaw`CREATE SCHEMA public;`
    await prisma.$executeRaw`GRANT ALL ON SCHEMA public TO postgres;`
    await prisma.$executeRaw`GRANT ALL ON SCHEMA public TO public;`

    console.log('Database cleaned successfully')
  } catch (error) {
    console.error('Error cleaning database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanup()