import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"

const prisma = new PrismaClient()

// Create a share link for a file
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const fileId = params.id
    const data = await request.json()

    // Find the file
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    })

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Check if the user owns this file
    if (file.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate a unique access code
    const accessCode = crypto.randomBytes(16).toString("hex")

    // Create the share record
    const share = await prisma.fileShare.create({
      data: {
        fileId: fileId,
        email: data.email || null,
        accessCode: accessCode,
        permission: data.permission || "view",
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    })

    return NextResponse.json({
      id: share.id,
      accessCode: share.accessCode,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/share/file/${share.accessCode}`,
    })
  } catch (error) {
    console.error("Error creating share link:", error)
    return NextResponse.json({ error: "Failed to create share link" }, { status: 500 })
  }
}

// Get all shares for a file
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const fileId = params.id

    // Find the file
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    })

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Check if the user owns this file
    if (file.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all shares for this file
    const shares = await prisma.fileShare.findMany({
      where: {
        fileId: fileId,
      },
    })

    // Format the shares for the frontend
    const formattedShares = shares.map((share) => ({
      id: share.id,
      email: share.email,
      accessCode: share.accessCode,
      permission: share.permission,
      expiresAt: share.expiresAt,
      createdAt: share.createdAt,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/share/file/${share.accessCode}`,
    }))

    return NextResponse.json(formattedShares)
  } catch (error) {
    console.error("Error fetching shares:", error)
    return NextResponse.json({ error: "Failed to fetch shares" }, { status: 500 })
  }
}
