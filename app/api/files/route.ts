import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import { generateFileKey, uploadFile } from "@/lib/s3-service"

const prisma = new PrismaClient()

// Helper to get file size in a readable format
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB"
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB"
  else return (bytes / 1073741824).toFixed(2) + " GB"
}

// Get all files for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const folderId = searchParams.get("folderId") || null
    const type = searchParams.get("type")
    const starred = searchParams.get("starred") === "true"

    const whereClause: any = {
      userId: session.user.id,
    }

    if (folderId) {
      whereClause.folderId = folderId
    } else if (folderId === null && !searchParams.has("all")) {
      // Root folder (null folderId) is the default if not specified
      whereClause.folderId = null
    }

    if (type) {
      whereClause.type = type
    }

    if (starred) {
      whereClause.isStarred = true
    }

    const files = await prisma.file.findMany({
      where: whereClause,
      orderBy: {
        updatedAt: "desc",
      },
    })

    // Format the files for the frontend
    const formattedFiles = files.map((file) => ({
      id: file.id,
      name: file.name,
      type: file.type,
      size: formatFileSize(file.size),
      sizeInBytes: file.size,
      isStarred: file.isStarred,
      folderId: file.folderId,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      modified: new Date(file.updatedAt).toLocaleString(),
    }))

    return NextResponse.json(formattedFiles)
  } catch (error) {
    console.error("Error fetching files:", error)
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 })
  }
}

// Upload a new file
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const folderId = (formData.get("folderId") as string) || null
    const buffer = Buffer.from(await file.arrayBuffer())
    const fileKey = generateFileKey(session.user.id, file.name)

    // Determine file type category
    const fileType = file.type.split("/")[0] || "other"

    // Upload file to S3
    await uploadFile(buffer, fileKey, file.type, true)

    // Create file record in database
    const newFile = await prisma.file.create({
      data: {
        name: file.name,
        type: fileType,
        size: file.size,
        url: fileKey, // We'll generate signed URLs when needed
        key: fileKey,
        userId: session.user.id,
        folderId: folderId,
      },
    })

    return NextResponse.json({
      id: newFile.id,
      name: newFile.name,
      type: newFile.type,
      size: formatFileSize(newFile.size),
      sizeInBytes: newFile.size,
      isStarred: newFile.isStarred,
      folderId: newFile.folderId,
      createdAt: newFile.createdAt,
      updatedAt: newFile.updatedAt,
      modified: new Date(newFile.updatedAt).toLocaleString(),
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
