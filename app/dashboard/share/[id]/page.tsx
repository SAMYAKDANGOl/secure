"use client"

import { FileSharing } from "@/components/file-sharing"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

// Mock data for files
const allFiles = [
  {
    id: "1",
    name: "Project Proposal.docx",
    type: "document",
    size: "2.4 MB",
    modified: "Today, 10:30 AM",
  },
  {
    id: "2",
    name: "Presentation.pptx",
    type: "presentation",
    size: "4.8 MB",
    modified: "Yesterday, 2:15 PM",
  },
  { id: "3", name: "Budget.xlsx", type: "spreadsheet", size: "1.2 MB", modified: "Apr 20, 2023" },
  { id: "4", name: "Team Photo.jpg", type: "image", size: "3.6 MB", modified: "Apr 18, 2023" },
  { id: "5", name: "Project Assets.zip", type: "archive", size: "24.2 MB", modified: "Apr 15, 2023" },
]

// Mock data for folders
const folders = [
  { id: "1", name: "Documents", files: 24, size: "128 MB" },
  { id: "2", name: "Images", files: 56, size: "2.4 GB" },
  { id: "3", name: "Projects", files: 18, size: "450 MB" },
  { id: "4", name: "Shared with me", files: 7, size: "32 MB" },
]

export default function SharePage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const itemId = params.id
  const itemType = searchParams.get("type") === "folder" ? "folder" : "file"

  const item = itemType === "folder" ? folders.find((f) => f.id === itemId) : allFiles.find((f) => f.id === itemId)

  if (!item) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Item not found</h1>
        <p className="text-muted-foreground">The item you're looking for doesn't exist or has been moved.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href={itemType === "folder" ? `/dashboard/folder/${itemId}` : `/dashboard/file/${itemId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold ml-4">Share {itemType === "folder" ? "Folder" : "File"}</h1>
      </div>

      <FileSharing item={item} type={itemType} />
    </div>
  )
}
