import type { NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function validateApiKey(request: NextRequest) {
  // Get the API key from the Authorization header
  const authHeader = request.headers.get("Authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const apiKey = authHeader.substring(7) // Remove "Bearer " prefix

  if (!apiKey) {
    return null
  }

  try {
    // Find the API key in the database
    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: {
        key: apiKey,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    if (!apiKeyRecord) {
      return null
    }

    // Check if the API key has expired
    if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
      return null
    }

    // Update the last used timestamp
    await prisma.apiKey.update({
      where: {
        id: apiKeyRecord.id,
      },
      data: {
        lastUsed: new Date(),
      },
    })

    // Return the user associated with the API key
    return apiKeyRecord.user
  } catch (error) {
    console.error("Error validating API key:", error)
    return null
  }
}

export function hasPermission(apiKeyRecord: any, requiredPermission: string) {
  return apiKeyRecord.permissions.includes(requiredPermission)
}
