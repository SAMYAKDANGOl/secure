"use client"

import type React from "react"

import { useRef } from "react"
import { Upload } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { useUpload } from "@/contexts/upload-context"

interface UploadButtonProps extends ButtonProps {
  multiple?: boolean
  accept?: string
  maxSize?: number // in bytes
  onUploadStarted?: () => void
}

export function UploadButton({
  children,
  multiple = true,
  accept = "*",
  maxSize,
  onUploadStarted,
  ...props
}: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadFiles } = useUpload()

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

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

    // Reset the input so the same file can be uploaded again
    e.target.value = ""
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple={multiple}
        accept={accept}
        onChange={handleFileChange}
      />
      <Button onClick={handleClick} {...props}>
        {children || (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </>
        )}
      </Button>
    </>
  )
}
