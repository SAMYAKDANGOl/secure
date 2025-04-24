"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Download,
  FileArchive,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Grid,
  List,
  MoreVertical,
  Share2,
  Star,
  Trash2,
} from "lucide-react"

export interface FileItem {
  id: number | string
  name: string
  type: string
  size: string
  modified: string
  icon?: any
  isStarred?: boolean
}

interface FileGridProps {
  files: FileItem[]
  title?: string
  emptyMessage?: string
}

export function FileGrid({ files, title = "Files", emptyMessage = "No files found" }: FileGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
      case "spreadsheet":
      case "presentation":
        return FileText
      case "image":
        return FileImage
      case "video":
        return FileVideo
      case "audio":
        return FileAudio
      case "archive":
        return FileArchive
      default:
        return FileText
    }
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">{emptyMessage}</h3>
        <p className="text-muted-foreground mt-2">Upload files to see them here</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-muted" : ""}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-muted" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file) => {
            const FileIcon = file.icon || getFileIcon(file.type)
            return (
              <Card key={file.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <Link href={`/dashboard/file/${file.id}`} className="group">
                      <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                        <FileIcon className="h-5 w-5" />
                      </div>
                    </Link>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-amber-500"
                        title={file.isStarred ? "Remove from starred" : "Add to starred"}
                      >
                        <Star className={`h-4 w-4 ${file.isStarred ? "fill-amber-500 text-amber-500" : ""}`} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/file/${file.id}`}>
                              <FileText className="mr-2 h-4 w-4" />
                              <span>Preview</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/share/${file.id}`}>
                              <Share2 className="mr-2 h-4 w-4" />
                              <span>Share</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <Link href={`/dashboard/file/${file.id}`} className="block mt-3 group">
                    <h3 className="font-medium truncate group-hover:text-primary transition-colors" title={file.name}>
                      {file.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {file.size} · {file.modified}
                    </p>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 text-sm font-medium">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Size</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Modified</th>
                <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => {
                const FileIcon = file.icon || getFileIcon(file.type)
                return (
                  <tr key={file.id} className={`border-t ${index % 2 === 0 ? "bg-muted/20" : ""}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Link href={`/dashboard/file/${file.id}`} className="group">
                          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                            <FileIcon className="h-4 w-4" />
                          </div>
                        </Link>
                        <Link href={`/dashboard/file/${file.id}`} className="font-medium hover:text-primary">
                          {file.name}
                        </Link>
                        {file.isStarred && <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{file.type}</td>
                    <td className="py-3 px-4 text-muted-foreground">{file.size}</td>
                    <td className="py-3 px-4 text-muted-foreground">{file.modified}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-amber-500"
                          title={file.isStarred ? "Remove from starred" : "Add to starred"}
                        >
                          <Star className={`h-4 w-4 ${file.isStarred ? "fill-amber-500 text-amber-500" : ""}`} />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/file/${file.id}`}>
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Preview</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              <span>Download</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/share/${file.id}`}>
                                <Share2 className="mr-2 h-4 w-4" />
                                <span>Share</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
