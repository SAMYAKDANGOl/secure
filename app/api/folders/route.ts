import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get all folders for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId") || null
    const starred = searchParams.get("starred") === "true"

    const whereClause: any = {
      userId: session.user.id,
    }

    if (parentId) {
      whereClause.parentId = parentId
    } else if (parentId === null && !searchParams.has("all")) {
      // Root folders (null parentId) is the default if not specified
      whereClause.parentId = null
    }

    if (starred) {
      whereClause.isStarred = true
    }

    const folders = await prisma.folder.findMany({
      where: whereClause,
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            files: true,
            children: true,
          },
        },
      },
    })

    // Get total size of files in each folder
    const foldersWithSize = await Promise.all(
      folders.map(async (folder) => {
        const files = await prisma.file.findMany({
          where: {
            folderId: folder.id,
          },
          select: {
            size: true,
          },
        })

        const totalSize = files.reduce((sum, file) => sum + file.size, 0)

        return {
          id: folder.id,
          name: folder.name,
          parentId: folder.parentId,
          isStarred: folder.isStarred,
          createdAt: folder.createdAt,
          updatedAt: folder.updatedAt,
          files: folder._count.files + folder._count.children,
          size: formatFileSize(totalSize),
        }
      }),
    )

    return NextResponse.json(foldersWithSize)
  } catch (error) {
    console.error("Error fetching folders:", error)
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 })
  }
}

// Create a new folder
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    if (!data.name) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 })
    }

    const newFolder = await prisma.folder.create({
      data: {
        name: data.name,
        parentId: data.parentId || null,
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      id: newFolder.id,
      name: newFolder.name,
      parentId: newFolder.parentId,
      isStarred: newFolder.isStarred,
      createdAt: newFolder.createdAt,
      updatedAt: newFolder.updatedAt,
      files: 0,
      size: "0 B",
    })
  } catch (error) {
    console.error("Error creating folder:", error)
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 })
  }
}

// Helper to get file size in a readable format
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB"
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB"
  else return (bytes / 1073741824).toFixed(2) + " GB"
}
