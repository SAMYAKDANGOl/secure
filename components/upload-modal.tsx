"use client"

import { useState, useRef } from "react"
import { X, Upload, AlertCircle, CheckCircle, FileText, FileImage, FileArchive, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUpload } from "@/contexts/upload-context"
import { formatFileSize } from "@/lib/upload-service"

export function UploadModal() {
  const { uploads, cancelUpload, clearCompleted, hasActiveUploads } = useUpload()
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-open modal when uploads are active
  if (hasActiveUploads && !isOpen) {
    setIsOpen(true)
  }

  const getFileIcon = (file: File) => {
    const type = file.type.split("/")[0]

    switch (type) {
      case "image":
        return <FileImage className="h-4 w-4" />
      case "video":
        return <FileText className="h-4 w-4" />
      case "audio":
        return <FileText className="h-4 w-4" />
      default:
        if (file.name.match(/\.(zip|rar|7z|tar|gz)$/i)) {
          return <FileArchive className="h-4 w-4" />
        }
        if (file.name.match(/\.(pdf|doc|docx|txt|rtf|xls|xlsx|ppt|pptx)$/i)) {
          return <FileText className="h-4 w-4" />
        }
        return <File className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-500"
      case "error":
        return "text-destructive"
      default:
        return "text-primary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  if (!isOpen && uploads.length === 0) {
    return null
  }

  const completedUploads = uploads.filter((upload) => upload.status === "success" || upload.status === "error")

  const hasCompletedUploads = completedUploads.length > 0

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-background rounded-lg shadow-lg border overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          <h3 className="font-medium text-sm">File Uploads</h3>
          {hasActiveUploads && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Uploading</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {hasCompletedUploads && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={clearCompleted}
              title="Clear completed uploads"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)} title="Minimize">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="max-h-80">
        <div className="p-3 space-y-3">
          {uploads.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">No active uploads</div>
          ) : (
            uploads.map((upload) => (
              <div key={upload.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 truncate max-w-[200px]">
                    <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center text-primary">
                      {getFileIcon(upload.file)}
                    </div>
                    <span className="truncate" title={upload.file.name}>
                      {upload.file.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(upload.status)}
                    {upload.status === "uploading" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => cancelUpload(upload.id)}
                        title="Cancel upload"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {upload.status === "uploading" && (
                  <div className="space-y-1">
                    <Progress value={upload.progress} className="h-1.5" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(upload.file.size)}</span>
                      <span>{Math.round(upload.progress)}%</span>
                    </div>
                  </div>
                )}

                {upload.status === "error" && (
                  <div className="text-xs text-destructive">{upload.error || "Upload failed"}</div>
                )}

                {upload.status === "success" && (
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(upload.file.size)} • Uploaded successfully
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
