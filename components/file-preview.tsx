"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Download,
  FileArchive,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  Info,
  Maximize2,
  Minimize2,
  Star,
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { FileItem } from "./file-grid"

interface FilePreviewProps {
  file: FileItem
}

export function FilePreview({ file }: FilePreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

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

  const FileIcon = file.icon || getFileIcon(file.type)

  const renderPreview = () => {
    switch (file.type) {
      case "image":
        return (
          <div className="flex items-center justify-center bg-muted/30 rounded-md p-4">
            <img
              src={`/placeholder.svg?height=400&width=600&text=${encodeURIComponent(file.name)}`}
              alt={file.name}
              className="max-w-full max-h-[400px] object-contain rounded"
            />
          </div>
        )
      case "video":
        return (
          <div className="bg-muted/30 rounded-md p-4">
            <div className="aspect-video bg-black rounded-md flex items-center justify-center">
              <FileVideo className="h-16 w-16 text-muted-foreground/50" />
            </div>
          </div>
        )
      case "audio":
        return (
          <div className="bg-muted/30 rounded-md p-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <FileAudio className="h-16 w-16 text-primary/70" />
              <div className="w-full max-w-md bg-muted h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-1/3 rounded-full"></div>
              </div>
              <div className="text-sm text-muted-foreground">Audio preview not available in demo</div>
            </div>
          </div>
        )
      case "document":
      case "spreadsheet":
      case "presentation":
        return (
          <div className="bg-muted/30 rounded-md p-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <FileIcon className="h-16 w-16 text-primary/70" />
              <div className="text-sm text-muted-foreground">Document preview not available in demo</div>
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-muted/30 rounded-md p-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <FileIcon className="h-16 w-16 text-primary/70" />
              <div className="text-sm text-muted-foreground">Preview not available</div>
            </div>
          </div>
        )
    }
  }

  const previewContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            <FileIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{file.name}</h2>
            <p className="text-sm text-muted-foreground">
              {file.size} · {file.modified}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-amber-500">
            <Star className={`h-5 w-5 ${file.isStarred ? "fill-amber-500 text-amber-500" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {renderPreview()}

      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" size="sm" className="gap-1">
          <Info className="h-4 w-4" />
          File Details
        </Button>
        <Button size="sm" className="gap-1">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  )

  if (isFullscreen) {
    return (
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-4xl w-full p-6">{previewContent}</DialogContent>
      </Dialog>
    )
  }

  return <Card className="p-6">{previewContent}</Card>
}
