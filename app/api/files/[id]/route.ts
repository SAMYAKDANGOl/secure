import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { getSignedDownloadUrl, deleteFile } from "@/lib/s3-service"

const prisma = new PrismaClient()

// Get a specific file
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const fileId = params.id

    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    })

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Check if the user has access to this file
    if (file.userId !== session.user.id) {
      // Check if the file is shared with this user
      const fileShare = await prisma.fileShare.findFirst({
        where: {
          fileId: fileId,
          email: session.user.email,
        },
      })

      if (!fileShare && !file.isPublic) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    // Generate a signed download URL
    const downloadUrl = await getSignedDownloadUrl(file.key, file.name)

    return NextResponse.json({
      ...file,
      downloadUrl,
    })
  } catch (error) {
    console.error("Error fetching file:", error)
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 })
  }
}

// Update a file
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Update the file
    const updatedFile = await prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        name: data.name,
        isStarred: data.isStarred,
        folderId: data.folderId,
        isPublic: data.isPublic,
      },
    })

    return NextResponse.json(updatedFile)
  } catch (error) {
    console.error("Error updating file:", error)
    return NextResponse.json({ error: "Failed to update file" }, { status: 500 })
  }
}

// Delete a file
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Delete the file from S3
    await deleteFile(file.key)

    // Delete the file from the database
    await prisma.file.delete({
      where: {
        id: fileId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
