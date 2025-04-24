"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export interface FileItem {
  id: string
  name: string
  type: string
  size: string
  sizeInBytes: number
  isStarred: boolean
  folderId: string | null
  createdAt: string
  updatedAt: string
  modified: string
}

export interface FolderItem {
  id: string
  name: string
  parentId: string | null
  isStarred: boolean
  createdAt: string
  updatedAt: string
  files: number
  size: string
}

interface FileContextType {
  files: FileItem[]
  folders: FolderItem[]
  currentFolderId: string | null
  isLoading: boolean
  error: string | null
  fetchFiles: (folderId?: string | null) => Promise<void>
  fetchFolders: (parentId?: string | null) => Promise<void>
  uploadFile: (file: File, folderId?: string | null) => Promise<FileItem>
  deleteFile: (fileId: string) => Promise<boolean>
  starFile: (fileId: string, isStarred: boolean) => Promise<boolean>
  renameFile: (fileId: string, newName: string) => Promise<boolean>
  createFolder: (name: string, parentId?: string | null) => Promise<FolderItem>
  deleteFolder: (folderId: string) => Promise<boolean>
  starFolder: (folderId: string, isStarred: boolean) => Promise<boolean>
  renameFolder: (folderId: string, newName: string) => Promise<boolean>
  moveFile: (fileId: string, folderId: string | null) => Promise<boolean>
  moveFolder: (folderId: string, parentId: string | null) => Promise<boolean>
  shareFile: (fileId: string, email: string, permission: string, expiresAt?: Date) => Promise<{ shareUrl: string }>
  shareFolder: (folderId: string, email: string, permission: string, expiresAt?: Date) => Promise<{ shareUrl: string }>
}

const FileContext = createContext<FileContextType | undefined>(undefined)

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileItem[]>([])
  const [folders, setFolders] = useState<FolderItem[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const fetchFiles = useCallback(
    async (folderId?: string | null) => {
      setIsLoading(true)
      setError(null)
      try {
        const queryParams = new URLSearchParams()
        if (folderId !== undefined) {
          setCurrentFolderId(folderId)
          if (folderId !== null) {
            queryParams.append("folderId", folderId)
          }
        } else if (currentFolderId !== null) {
          queryParams.append("folderId", currentFolderId)
        }

        const response = await fetch(`/api/files?${queryParams.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch files")
        }

        const data = await response.json()
        setFiles(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          title: "Error",
          description: "Failed to fetch files",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [currentFolderId, toast],
  )

  const fetchFolders = useCallback(
    async (parentId?: string | null) => {
      setIsLoading(true)
      setError(null)
      try {
        const queryParams = new URLSearchParams()
        if (parentId !== undefined) {
          if (parentId !== null) {
            queryParams.append("parentId", parentId)
          }
        } else if (currentFolderId !== null) {
          queryParams.append("parentId", currentFolderId)
        }

        const response = await fetch(`/api/folders?${queryParams.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch folders")
        }

        const data = await response.json()
        setFolders(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          title: "Error",
          description: "Failed to fetch folders",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [currentFolderId, toast],
  )

  const uploadFile = useCallback(
    async (file: File, folderId?: string | null): Promise<FileItem> => {
      setIsLoading(true)
      setError(null)
      try {
        const formData = new FormData()
        formData.append("file", file)

        if (folderId !== undefined) {
          if (folderId !== null) {
            formData.append("folderId", folderId)
          }
        } else if (currentFolderId !== null) {
          formData.append("folderId", currentFolderId)
        }

        const response = await fetch("/api/files", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to upload file")
        }

        const newFile = await response.json()
        setFiles((prev) => [newFile, ...prev])

        toast({
          title: "Success",
          description: "File uploaded successfully",
        })

        return newFile
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          title: "Error",
          description: "Failed to upload file",
          variant: "destructive",
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [currentFolderId, toast],
  )

  const deleteFile = useCallback(
    async (fileId: string): Promise<boolean> => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/files/${fileId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete file")
        }

        setFiles((prev) => prev.filter((file) => file.id !== fileId))

        toast({
          title: "Success",
          description: "File deleted successfully",
        })

        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          title: "Error",
          description: "Failed to delete file",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const starFile = useCallback(
    async (fileId: string, isStarred: boolean): Promise<boolean> => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/files/${fileId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isStarred }),
        })

        if (!response.ok) {
          throw new Error("Failed to update file")
        }

        setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, isStarred } : file)))

        toast({
          title: "Success",
          description: isStarred ? "File added to starred" : "File removed from starred",
        })

        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          title: "Error",
          description: "Failed to update file",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const renameFile = useCallback(
    async (fileId: string, newName: string): Promise<boolean> => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/files/${fileId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName }),
        })

        if (!response.ok) {
          throw new Error("Failed to rename file")
        }

        setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, name: newName } : file)))

        toast({
          title: "Success",
          description: "File renamed successfully",
        })

        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          title: "Error",
          description: "Failed to rename file",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const createFolder = useCallback(
    async (name: string, parentId?: string | null): Promise<FolderItem> => {
      setIsLoading(true)
      setError(null)
      try {
        const folderParentId = parentId !== undefined ? parentId : currentFolderId

        const response = await fetch("/api/folders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, parentId: folderParentId }),
        })

        if (!response.ok) {
          throw new Error("Failed to create folder")
        }

        const newFolder = await response.json()
        setFolders((prev) => [newFolder, ...prev])

        toast({
          title: "Success",
          description: "Folder created successfully",
        })

        return newFolder
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          title: "Error",
          description: "Failed to create folder",
          variant: "destructive",
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [currentFolderId, toast],
  )

  const deleteFolder = useCallback(
    async (folderId: string): Promise<boolean> => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/folders/${folderId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete folder")
        }

        setFolders((prev) => prev.filter((folder) => folder.id !== folderId))

        toast({
          title: "Success",
          description: "Folder deleted successfully",
        })

        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          title: "Error",
          description: "Failed to delete folder",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const starFolder = useCallback(
    async (folderId: string, isStarred: boolean): Promise<boolean> => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/folders/${folderId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isStarred }),
        })

        if (!response.ok) {
          throw new Error("Failed to update folder")
        }

        setFolders((prev) => prev.map((folder) => (folder.id === folderId ? { ...folder, isStarred } : folder)))

        toast({
          title: "Success",
          description: isStarred ? "Folder added to starred" : "Folder removed from starred",
        })

        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          title: "Error",
          description: "Failed to update folder",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const renameFolder = useCallback(
    async (folderId: string, newName: string): Promise<boolean> => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/folders/${folderId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName }),
        })

        if (!response.ok) {
          throw new Error("Failed to rename folder")
        }

        setFolders((prev) => prev.map((folder) => (folder.id === folderId ? { ...folder, name: newName } : folder)))

        toast({
          title: "Success",
          description: "Folder renamed successfully",
        })

        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          title: "Error",
          description: "Failed to rename folder",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const moveFile = useCallback(
    async (fileId: string, folderId: string | null): Promise<boolean> => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/files/${fileId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ folderId }),
        })

        if (!response.ok) {
          throw new Error("Failed to move file")
        }

        // Remove the file from the current view if it's moved to a different folder
        if (folderId !== currentFolderId) {
          setFiles((prev) => prev.filter((file) => file.id !== fileId))
        }

        toast({
          title: "Success",
          description: "File moved successfully",
        })

        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          title: "Error",
          description: "Failed to move file",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [currentFolderId, toast],
  )

  const moveFolder = useCallback(
    async (folderId: string, parentId: string | null): Promise<boolean> => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/folders/${folderId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ parentId }),
        })

        if (!response.ok) {
          throw new Error("Failed to move folder")
        }

        // Remove the folder from the current view if it's moved to a different parent
        if (parentId !== currentFolderId) {
          setFolders((prev) => prev.filter((folder) => folder.id !== folderId))
        }

        toast({
          title: "Success",
          description: "Folder moved successfully",
        })

        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          title: "Error",
          description: "Failed to move folder",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [currentFolderId, toast],
  )

  const shareFile = useCallback(
    async (fileId: string, email: string, permission: string, expiresAt?: Date): Promise<{ shareUrl: string }> => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/files/${fileId}/share`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, permission, expiresAt }),
        })

        if (!response.ok) {
          throw new Error("Failed to share file")
        }

        const data = await response.json()

        toast({
          title: "Success",
          description: "File shared successfully",
        })

        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          title: "Error",
          description: "Failed to share file",
          variant: "destructive",
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const shareFolder = useCallback(
    async (folderId: string, email: string, permission: string, expiresAt?: Date): Promise<{ shareUrl: string }> => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/folders/${folderId}/share`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, permission, expiresAt }),
        })

        if (!response.ok) {
          throw new Error("Failed to share folder")
        }

        const data = await response.json()

        toast({
          title: "Success",
          description: "Folder shared successfully",
        })

        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        toast({
          title: "Error",
          description: "Failed to share folder",
          variant: "destructive",
        })
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  return (
    <FileContext.Provider
      value={{
        files,
        folders,
        currentFolderId,
        isLoading,
        error,
        fetchFiles,
        fetchFolders,
        uploadFile,
        deleteFile,
        starFile,
        renameFile,
        createFolder,
        deleteFolder,
        starFolder,
        renameFolder,
        moveFile,
        moveFolder,
        shareFile,
        shareFolder,
      }}
    >
      {children}
    </FileContext.Provider>
  )
}

export const useFiles = () => {
  const context = useContext(FileContext)
  if (context === undefined) {
    throw new Error("useFiles must be used within a FileProvider")
  }
  return context
}
