"use client"

import { FileGrid, type FileItem } from "@/components/file-grid"
import { FolderGrid, type FolderItem } from "@/components/folder-grid"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

// Mock data for all files
const allFiles: FileItem[] = [
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
  { id: 9, name: "Marketing Plan.docx", type: "document", size: "3.2 MB", modified: "Apr 3, 2023" },
  { id: 10, name: "Sales Report.xlsx", type: "spreadsheet", size: "2.1 MB", modified: "Apr 1, 2023" },
]

// Mock data for all folders
const allFolders: FolderItem[] = [
  { id: 1, name: "Documents", files: 24, size: "128 MB" },
  { id: 2, name: "Images", files: 56, size: "2.4 GB" },
  { id: 3, name: "Projects", files: 18, size: "450 MB" },
  { id: 4, name: "Shared with me", files: 7, size: "32 MB" },
  { id: 5, name: "Marketing", files: 12, size: "85 MB" },
  { id: 6, name: "Sales", files: 9, size: "64 MB" },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([])
  const [filteredFolders, setFilteredFolders] = useState<FolderItem[]>([])

  useEffect(() => {
    if (query) {
      const lowerQuery = query.toLowerCase()

      // Filter files
      const matchingFiles = allFiles.filter(
        (file) => file.name.toLowerCase().includes(lowerQuery) || file.type.toLowerCase().includes(lowerQuery),
      )
      setFilteredFiles(matchingFiles)

      // Filter folders
      const matchingFolders = allFolders.filter((folder) => folder.name.toLowerCase().includes(lowerQuery))
      setFilteredFolders(matchingFolders)
    } else {
      setFilteredFiles([])
      setFilteredFolders([])
    }
  }, [query])

  const totalResults = filteredFiles.length + filteredFolders.length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Search Results</h1>
        <p className="text-muted-foreground">
          {query ? (
            <>
              Found {totalResults} {totalResults === 1 ? "result" : "results"} for "{query}"
            </>
          ) : (
            "Enter a search term to find files and folders"
          )}
        </p>
      </div>

      {query && totalResults === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-lg font-medium mb-2">No results found</h2>
          <p className="text-muted-foreground">Try a different search term or browse your files</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredFolders.length > 0 && <FolderGrid folders={filteredFolders} title="Folders" />}

          {filteredFiles.length > 0 && <FileGrid files={filteredFiles} title="Files" />}
        </div>
      )}
    </div>
  )
}
