import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { deleteFile } from "@/lib/s3-service"

const prisma = new PrismaClient()

// Get a specific folder
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const folderId = params.id

    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
      include: {
        files: true,
        children: true,
        _count: {
          select: {
            files: true,
            children: true,
          },
        },
      },
    })

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 })
    }

    // Check if the user has access to this folder
    if (folder.userId !== session.user.id) {
      // Check if the folder is shared with this user
      const folderShare = await prisma.folderShare.findFirst({
        where: {
          folderId: folderId,
          email: session.user.email,
        },
      })

      if (!folderShare) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    // Calculate total size
    const totalSize = folder.files.reduce((sum, file) => sum + file.size, 0)

    return NextResponse.json({
      ...folder,
      totalSize,
      formattedSize: formatFileSize(totalSize),
    })
  } catch (error) {
    console.error("Error fetching folder:", error)
    return NextResponse.json({ error: "Failed to fetch folder" }, { status: 500 })
  }
}

// Update a folder
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const folderId = params.id
    const data = await request.json()

    // Find the folder
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
    })

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 })
    }

    // Check if the user owns this folder
    if (folder.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update the folder
    const updatedFolder = await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name: data.name,
        isStarred: data.isStarred,
        parentId: data.parentId,
      },
    })

    return NextResponse.json(updatedFolder)
  } catch (error) {
    console.error("Error updating folder:", error)
    return NextResponse.json({ error: "Failed to update folder" }, { status: 500 })
  }
}

// Delete a folder and all its contents recursively
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const folderId = params.id

    // Find the folder
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
    })

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 })
    }

    // Check if the user owns this folder
    if (folder.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete the folder and its contents recursively
    await deleteFolder(folderId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting folder:", error)
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 })
  }
}

// Helper function to delete a folder and its contents recursively
async function deleteFolder(folderId: string) {
  // Get all files in the folder
  const files = await prisma.file.findMany({
    where: {
      folderId: folderId,
    },
  })

  // Delete all files from S3
  for (const file of files) {
    await deleteFile(file.key)
  }

  // Get all subfolders
  const subfolders = await prisma.folder.findMany({
    where: {
      parentId: folderId,
    },
  })

  // Recursively delete subfolders
  for (const subfolder of subfolders) {
    await deleteFolder(subfolder.id)
  }

  // Delete the folder itself
  await prisma.folder.delete({
    where: {
      id: folderId,
    },
  })
}

// Helper to get file size in a readable format
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB"
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB"
  else return (bytes / 1073741824).toFixed(2) + " GB"
}
