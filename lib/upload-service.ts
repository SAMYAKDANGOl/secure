// This is a simulated upload service for demo purposes
// In a real application, this would connect to your backend API

export interface UploadFile {
  id: string
  file: File
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  error?: string
  url?: string
  createdAt: Date
}

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

// Simulate file upload with progress tracking
export async function uploadFile(file: File, onProgress: (progress: number) => void): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    // Generate a random upload speed between 500KB/s and 2MB/s
    const uploadSpeed = Math.random() * 1500000 + 500000 // bytes per second
    const fileSize = file.size

    // Calculate how long the upload should take
    const uploadTime = (fileSize / uploadSpeed) * 1000 // in milliseconds

    // Minimum upload time of 1.5 seconds for demo purposes
    const minUploadTime = 1500
    const actualUploadTime = Math.max(uploadTime, minUploadTime)

    // Update progress every 100ms
    const interval = 100
    const steps = actualUploadTime / interval
    let currentStep = 0

    const progressInterval = setInterval(() => {
      currentStep++
      const currentProgress = Math.min((currentStep / steps) * 100, 99.9)
      onProgress(currentProgress)

      if (currentStep >= steps) {
        clearInterval(progressInterval)

        // Simulate a small delay for server processing
        setTimeout(() => {
          // 5% chance of upload error for demo purposes
          if (Math.random() < 0.05) {
            resolve({
              success: false,
              error: "Server error: Failed to process upload",
            })
          } else {
            onProgress(100)
            resolve({
              success: true,
              url: URL.createObjectURL(file), // In a real app, this would be a server URL
            })
          }
        }, 500)
      }
    }, interval)
  })
}

// Get file type category
export function getFileTypeCategory(file: File): string {
  const type = file.type.split("/")[0]

  switch (type) {
    case "image":
      return "image"
    case "video":
      return "video"
    case "audio":
      return "audio"
    default:
      // Check for common document types
      if (file.name.match(/\.(pdf|doc|docx|txt|rtf|odt)$/i)) {
        return "document"
      }
      if (file.name.match(/\.(xls|xlsx|csv|ods)$/i)) {
        return "spreadsheet"
      }
      if (file.name.match(/\.(ppt|pptx|odp)$/i)) {
        return "presentation"
      }
      if (file.name.match(/\.(zip|rar|7z|tar|gz)$/i)) {
        return "archive"
      }
      return "other"
  }
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
