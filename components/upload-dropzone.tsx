"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload } from "lucide-react"
import { useUpload } from "@/contexts/upload-context"

interface UploadDropzoneProps {
  className?: string
  multiple?: boolean
  maxSize?: number // in bytes
  accept?: string[]
  onUploadStarted?: () => void
}

export function UploadDropzone({ className, multiple = true, maxSize, accept, onUploadStarted }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const { uploadFiles } = useUpload()

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (!files || files.length === 0) return

      // Check if multiple files are allowed
      if (!multiple && files.length > 1) {
        alert("Only one file can be uploaded at a time")
        return
      }

      // Check file types if accept is provided
      if (accept && accept.length > 0) {
        const invalidFiles = Array.from(files).filter((file) => {
          const fileType = file.type.split("/")[0]
          const fileExtension = file.name.split(".").pop()?.toLowerCase()

          return !accept.some((type) => {
            if (type.startsWith(".")) {
              // Check extension
              return `.${fileExtension}` === type
            } else if (type.includes("/*")) {
              // Check mime type category
              const category = type.split("/")[0]
              return fileType === category
            } else {
              // Check exact mime type
              return file.type === type
            }
          })
        })

        if (invalidFiles.length > 0) {
          alert(`Some files have invalid types. Accepted types: ${accept.join(", ")}`)
          return
        }
      }

      // Check file size if maxSize is provided
      if (maxSize) {
        const oversizedFiles = Array.from(files).filter((file) => file.size > maxSize)
        if (oversizedFiles.length > 0) {
          alert(`Some files exceed the maximum size of ${maxSize / (1024 * 1024)}MB`)
          return
        }
      }

      uploadFiles(files)
      if (onUploadStarted) onUploadStarted()
    },
    [multiple, accept, maxSize, uploadFiles, onUploadStarted],
  )

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center
        ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"}
        transition-colors duration-200 ease-in-out
        ${className}
      `}
    >
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Upload className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium">{isDragging ? "Drop files here" : "Drag and drop files here"}</p>
          <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
        </div>
      </div>
    </div>
  )
}
