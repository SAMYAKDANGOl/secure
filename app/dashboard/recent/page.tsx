"use client"

import { FileGrid, type FileItem } from "@/components/file-grid"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

// Mock data for recent files
const recentFiles: FileItem[] = [
  {
    id: 1,
    name: "Project Proposal.docx",
    type: "document",
    size: "2.4 MB",
    modified: "Today, 10:30 AM",
  },
  {
    id: 2,
    name: "Presentation.pptx",
    type: "presentation",
    size: "4.8 MB",
    modified: "Yesterday, 2:15 PM",
  },
  { id: 3, name: "Budget.xlsx", type: "spreadsheet", size: "1.2 MB", modified: "Apr 20, 2023" },
  { id: 4, name: "Team Photo.jpg", type: "image", size: "3.6 MB", modified: "Apr 18, 2023" },
  { id: 5, name: "Project Assets.zip", type: "archive", size: "24.2 MB", modified: "Apr 15, 2023" },
  { id: 6, name: "Meeting Notes.pdf", type: "document", size: "1.8 MB", modified: "Apr 12, 2023" },
  { id: 7, name: "Product Demo.mp4", type: "video", size: "58.2 MB", modified: "Apr 10, 2023" },
  { id: 8, name: "Logo Design.ai", type: "image", size: "5.4 MB", modified: "Apr 5, 2023" },
]

export default function RecentFilesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Recent Files</h1>
        <p className="text-muted-foreground">Files you've recently accessed or modified</p>
      </div>

      <div className="mb-6">
        <Button variant="outline" size="sm" className="gap-1">
          <Clock className="h-4 w-4" />
          Clear history
        </Button>
      </div>

      <FileGrid files={recentFiles} title="Recently Accessed" />
    </div>
  )
}
