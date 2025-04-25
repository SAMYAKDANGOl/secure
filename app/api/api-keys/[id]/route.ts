import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get a specific API key
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const apiKeyId = params.id

    const apiKey = await prisma.apiKey.findUnique({
      where: {
        id: apiKeyId,
      },
      select: {
        id: true,
        name: true,
        permissions: true,
        expiresAt: true,
        lastUsed: true,
        createdAt: true,
        userId: true,
        // Don't return the actual key for security
      },
    })

    if (!apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 })
    }

    // Check if the user owns this API key
    if (apiKey.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(apiKey)
  } catch (error) {
    console.error("Error fetching API key:", error)
    return NextResponse.json({ error: "Failed to fetch API key" }, { status: 500 })
  }
}

// Update an API key
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const apiKeyId = params.id
    const data = await request.json()

    // Find the API key
    const apiKey = await prisma.apiKey.findUnique({
      where: {
        id: apiKeyId,
      },
    })

    if (!apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 })
    }

    // Check if the user owns this API key
    if (apiKey.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update the API key
    const updatedApiKey = await prisma.apiKey.update({
      where: {
        id: apiKeyId,
      },
      data: {
        name: data.name,
        permissions: data.permissions,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    })

    return NextResponse.json({
      id: updatedApiKey.id,
      name: updatedApiKey.name,
      permissions: updatedApiKey.permissions,
      expiresAt: updatedApiKey.expiresAt,
      lastUsed: updatedApiKey.lastUsed,
      createdAt: updatedApiKey.createdAt,
    })
  } catch (error) {
    console.error("Error updating API key:", error)
    return NextResponse.json({ error: "Failed to update API key" }, { status: 500 })
  }
}

// Delete an API key
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const apiKeyId = params.id

    // Find the API key
    const apiKey = await prisma.apiKey.findUnique({
      where: {
        id: apiKeyId,
      },
    })

    if (!apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 })
    }

    // Check if the user owns this API key
    if (apiKey.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete the API key
    await prisma.apiKey.delete({
      where: {
        id: apiKeyId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting API key:", error)
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 })
  }
}
