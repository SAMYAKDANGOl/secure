"use client"

import { FileGrid, type FileItem } from "@/components/file-grid"
import { FolderGrid, type FolderItem } from "@/components/folder-grid"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for shared files
const sharedWithMeFiles: FileItem[] = [
  {
    id: 1,
    name: "Team Project Plan.docx",
    type: "document",
    size: "2.4 MB",
    modified: "Today, 10:30 AM",
  },
  {
    id: 2,
    name: "Marketing Presentation.pptx",
    type: "presentation",
    size: "4.8 MB",
    modified: "Yesterday, 2:15 PM",
  },
  {
    id: 3,
    name: "Q2 Budget.xlsx",
    type: "spreadsheet",
    size: "1.2 MB",
    modified: "Apr 20, 2023",
  },
]

// Mock data for shared folders
const sharedWithMeFolders: FolderItem[] = [
  { id: 4, name: "Team Documents", files: 24, size: "128 MB" },
  { id: 5, name: "Marketing Assets", files: 56, size: "2.4 GB" },
]

// Mock data for files shared by me
const sharedByMeFiles: FileItem[] = [
  {
    id: 6,
    name: "Project Proposal.docx",
    type: "document",
    size: "2.4 MB",
    modified: "Apr 15, 2023",
  },
  {
    id: 7,
    name: "Client Presentation.pptx",
    type: "presentation",
    size: "4.8 MB",
    modified: "Apr 10, 2023",
  },
]

export default function SharedPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Shared</h1>
        <p className="text-muted-foreground">Files and folders shared with you or by you</p>
      </div>

      <Tabs defaultValue="with-me" className="mb-6">
        <TabsList>
          <TabsTrigger value="with-me">Shared with me</TabsTrigger>
          <TabsTrigger value="by-me">Shared by me</TabsTrigger>
        </TabsList>
        <TabsContent value="with-me" className="space-y-8 mt-6">
          <FolderGrid folders={sharedWithMeFolders} title="Folders" />
          <FileGrid files={sharedWithMeFiles} title="Files" />
        </TabsContent>
        <TabsContent value="by-me" className="space-y-8 mt-6">
          <FileGrid files={sharedByMeFiles} title="Files" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
