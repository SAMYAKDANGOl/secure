import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"

const prisma = new PrismaClient()

// Generate a secure API key
function generateApiKey(): string {
  return `vg_${crypto.randomBytes(32).toString("hex")}`
}

// Get all API keys for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        permissions: true,
        expiresAt: true,
        lastUsed: true,
        createdAt: true,
        // Don't return the actual key for security
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(apiKeys)
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
  }
}

// Create a new API key
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    if (!data.name) {
      return NextResponse.json({ error: "API key name is required" }, { status: 400 })
    }

    // Default permissions if not provided
    const permissions = data.permissions || ["read"]

    // Generate a new API key
    const apiKey = generateApiKey()

    // Create the API key in the database
    const newApiKey = await prisma.apiKey.create({
      data: {
        name: data.name,
        key: apiKey,
        userId: session.user.id,
        permissions: permissions,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    })

    // Return the full key only once - after this, it won't be retrievable
    return NextResponse.json({
      id: newApiKey.id,
      name: newApiKey.name,
      key: apiKey, // Only returned once
      permissions: newApiKey.permissions,
      expiresAt: newApiKey.expiresAt,
      createdAt: newApiKey.createdAt,
    })
  } catch (error) {
    console.error("Error creating API key:", error)
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
}
