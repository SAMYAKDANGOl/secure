import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  try {
    // Create a demo user
    const hashedPassword = await hash("password123", 10)

    const user = await prisma.user.upsert({
      where: { email: "demo@example.com" },
      update: {},
      create: {
        email: "demo@example.com",
        name: "Demo User",
        firstName: "Demo",
        lastName: "User",
        password: hashedPassword,
        accountType: "personal",
      },
    })

    console.log(`Created user: ${user.email}`)

    // Create some demo folders
    const documents = await prisma.folder.upsert({
      where: { id: "1" },
      update: {},
      create: {
        id: "1",
        name: "Documents",
        userId: user.id,
      },
    })

    const images = await prisma.folder.upsert({
      where: { id: "2" },
      update: {},
      create: {
        id: "2",
        name: "Images",
        userId: user.id,
      },
    })

    console.log(`Created folders: ${documents.name}, ${images.name}`)

    console.log("Database initialization completed successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
