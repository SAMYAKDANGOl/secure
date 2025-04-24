"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import { type UploadFile, uploadFile as uploadFileService } from "@/lib/upload-service"

interface UploadContextType {
  uploads: UploadFile[]
  uploadFiles: (files: FileList | File[]) => void
  cancelUpload: (id: string) => void
  clearCompleted: () => void
  hasActiveUploads: boolean
}

const UploadContext = createContext<UploadContextType | undefined>(undefined)

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [uploads, setUploads] = useState<UploadFile[]>([])

  const hasActiveUploads = uploads.some((upload) => upload.status === "uploading" || upload.status === "pending")

  const uploadFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)

    const newUploads = fileArray.map((file) => ({
      id: uuidv4(),
      file,
      progress: 0,
      status: "pending" as const,
      createdAt: new Date(),
    }))

    setUploads((prev) => [...newUploads, ...prev])

    // Process each upload
    newUploads.forEach((upload) => {
      // Set status to uploading
      setUploads((prev) => prev.map((u) => (u.id === upload.id ? { ...u, status: "uploading" as const } : u)))

      // Start upload with progress tracking
      uploadFileService(upload.file, (progress) => {
        setUploads((prev) => prev.map((u) => (u.id === upload.id ? { ...u, progress } : u)))
      })
        .then((result) => {
          if (result.success) {
            setUploads((prev) =>
              prev.map((u) =>
                u.id === upload.id
                  ? {
                      ...u,
                      status: "success" as const,
                      progress: 100,
                      url: result.url,
                    }
                  : u,
              ),
            )
          } else {
            setUploads((prev) =>
              prev.map((u) =>
                u.id === upload.id
                  ? {
                      ...u,
                      status: "error" as const,
                      error: result.error,
                    }
                  : u,
              ),
            )
          }
        })
        .catch((error) => {
          setUploads((prev) =>
            prev.map((u) =>
              u.id === upload.id
                ? {
                    ...u,
                    status: "error" as const,
                    error: error.message,
                  }
                : u,
            ),
          )
        })
    })
  }, [])

  const cancelUpload = useCallback((id: string) => {
    // In a real app, you would abort the actual upload request
    setUploads((prev) => prev.filter((upload) => upload.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setUploads((prev) => prev.filter((upload) => upload.status !== "success" && upload.status !== "error"))
  }, [])

  return (
    <UploadContext.Provider
      value={{
        uploads,
        uploadFiles,
        cancelUpload,
        clearCompleted,
        hasActiveUploads,
      }}
    >
      {children}
    </UploadContext.Provider>
  )
}

export function useUpload() {
  const context = useContext(UploadContext)
  if (context === undefined) {
    throw new Error("useUpload must be used within an UploadProvider")
  }
  return context
}
