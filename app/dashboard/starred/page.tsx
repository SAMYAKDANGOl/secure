"use client"

import { FileGrid, type FileItem } from "@/components/file-grid"
import { FolderGrid, type FolderItem } from "@/components/folder-grid"

// Mock data for starred files
const starredFiles: FileItem[] = [
  {
    id: 1,
    name: "Important Document.docx",
    type: "document",
    size: "2.4 MB",
    modified: "Today, 10:30 AM",
    isStarred: true,
  },
  {
    id: 2,
    name: "Client Presentation.pptx",
    type: "presentation",
    size: "4.8 MB",
    modified: "Yesterday, 2:15 PM",
    isStarred: true,
  },
  {
    id: 3,
    name: "Financial Report.xlsx",
    type: "spreadsheet",
    size: "1.2 MB",
    modified: "Apr 20, 2023",
    isStarred: true,
  },
]

// Mock data for starred folders
const starredFolders: FolderItem[] = [
  { id: 1, name: "Important Documents", files: 24, size: "128 MB" },
  { id: 2, name: "Client Projects", files: 18, size: "450 MB" },
]

export default function StarredPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Starred</h1>
        <p className="text-muted-foreground">Files and folders you've marked as important</p>
      </div>

      <div className="space-y-8">
        <FolderGrid folders={starredFolders} title="Starred Folders" />
        <FileGrid files={starredFiles} title="Starred Files" />
      </div>
    </div>
  )
}
