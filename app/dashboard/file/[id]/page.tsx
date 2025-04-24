"use client"

import { FilePreview } from "@/components/file-preview"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, Star, Trash2 } from "lucide-react"
import Link from "next/link"

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
  { id: "6", name: "Product Demo.mp4", type: "video", size: "58.2 MB", modified: "Apr 10, 2023" },
  { id: "7", name: "Company Jingle.mp3", type: "audio", size: "3.8 MB", modified: "Apr 5, 2023" },
]

export default function FilePage({ params }: { params: { id: string } }) {
  const fileId = params.id
  const file = allFiles.find((f) => f.id === fileId)

  if (!file) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">File not found</h1>
        <p className="text-muted-foreground">The file you're looking for doesn't exist or has been moved.</p>
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
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Star className="h-4 w-4" />
            Star
          </Button>
          <Button variant="outline" size="sm" className="gap-1" asChild>
            <Link href={`/dashboard/share/${fileId}`}>
              <Share2 className="h-4 w-4" />
              Share
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="gap-1 text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <FilePreview file={file} />
    </div>
  )
}
