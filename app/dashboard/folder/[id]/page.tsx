"use client"

import { FileGrid, type FileItem } from "@/components/file-grid"
import { Button } from "@/components/ui/button"
import { FolderPlus } from "lucide-react"
import { UploadDialog } from "@/components/upload-dialog"

// Mock data for folders
const folders = [
  { id: "1", name: "Documents", files: 24, size: "128 MB" },
  { id: "2", name: "Images", files: 56, size: "2.4 GB" },
  { id: "3", name: "Projects", files: 18, size: "450 MB" },
  { id: "4", name: "Shared with me", files: 7, size: "32 MB" },
]

// Mock data for files by folder
const filesByFolder: Record<string, FileItem[]> = {
  "1": [
    {
      id: 101,
      name: "Project Proposal.docx",
      type: "document",
      size: "2.4 MB",
      modified: "Today, 10:30 AM",
    },
    {
      id: 102,
      name: "Meeting Notes.pdf",
      type: "document",
      size: "1.8 MB",
      modified: "Yesterday, 2:15 PM",
    },
    {
      id: 103,
      name: "Contract.pdf",
      type: "document",
      size: "3.2 MB",
      modified: "Apr 20, 2023",
    },
  ],
  "2": [
    {
      id: 201,
      name: "Team Photo.jpg",
      type: "image",
      size: "3.6 MB",
      modified: "Today, 10:30 AM",
    },
    {
      id: 202,
      name: "Product Banner.png",
      type: "image",
      size: "2.8 MB",
      modified: "Yesterday, 2:15 PM",
    },
    {
      id: 203,
      name: "Logo.svg",
      type: "image",
      size: "0.5 MB",
      modified: "Apr 20, 2023",
    },
  ],
  "3": [
    {
      id: 301,
      name: "Project Plan.xlsx",
      type: "spreadsheet",
      size: "1.2 MB",
      modified: "Today, 10:30 AM",
    },
    {
      id: 302,
      name: "Presentation.pptx",
      type: "presentation",
      size: "4.8 MB",
      modified: "Yesterday, 2:15 PM",
    },
    {
      id: 303,
      name: "Source Code.zip",
      type: "archive",
      size: "24.2 MB",
      modified: "Apr 20, 2023",
    },
  ],
  "4": [
    {
      id: 401,
      name: "Shared Document.docx",
      type: "document",
      size: "2.4 MB",
      modified: "Today, 10:30 AM",
    },
    {
      id: 402,
      name: "Team Presentation.pptx",
      type: "presentation",
      size: "4.8 MB",
      modified: "Yesterday, 2:15 PM",
    },
  ],
}

export default function FolderPage({ params }: { params: { id: string } }) {
  const folderId = params.id
  const folder = folders.find((f) => f.id === folderId)
  const files = filesByFolder[folderId] || []

  if (!folder) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Folder not found</h1>
        <p className="text-muted-foreground">The folder you're looking for doesn't exist or has been moved.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{folder.name}</h1>
        <p className="text-muted-foreground">
          {folder.files} files · {folder.size}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <UploadDialog />
          <Button variant="outline">
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
        </div>
      </div>

      <FileGrid files={files} title="Files" emptyMessage={`No files in ${folder.name}`} />
    </div>
  )
}
