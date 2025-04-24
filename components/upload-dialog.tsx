"use client"

import { useState } from "react"
import { Upload, FileText, FileImage, FileVideo, Music } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadButton } from "@/components/upload-button"
import { UploadDropzone } from "@/components/upload-dropzone"

// Maximum file size: 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024

export function UploadDialog() {
  const [open, setOpen] = useState(false)

  const handleUploadStarted = () => {
    // Close the dialog after upload starts
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <UploadDropzone multiple={true} maxSize={MAX_FILE_SIZE} onUploadStarted={handleUploadStarted} />
            <div className="mt-4 flex justify-between">
              <p className="text-xs text-muted-foreground">Maximum file size: 100MB</p>
              <UploadButton
                variant="outline"
                size="sm"
                multiple={true}
                maxSize={MAX_FILE_SIZE}
                onUploadStarted={handleUploadStarted}
              >
                Browse Files
              </UploadButton>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <UploadDropzone
              multiple={true}
              maxSize={MAX_FILE_SIZE}
              accept={[".pdf", ".doc", ".docx", ".txt", ".rtf", ".xls", ".xlsx", ".ppt", ".pptx", "application/*"]}
              onUploadStarted={handleUploadStarted}
            />
            <div className="mt-4 flex justify-between">
              <div className="flex items-center text-xs text-muted-foreground">
                <FileText className="h-3 w-3 mr-1" />
                <span>PDF, Word, Excel, PowerPoint, etc.</span>
              </div>
              <UploadButton
                variant="outline"
                size="sm"
                multiple={true}
                maxSize={MAX_FILE_SIZE}
                accept=".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.ppt,.pptx"
                onUploadStarted={handleUploadStarted}
              >
                Browse Documents
              </UploadButton>
            </div>
          </TabsContent>

          <TabsContent value="images" className="mt-4">
            <UploadDropzone
              multiple={true}
              maxSize={MAX_FILE_SIZE}
              accept={["image/*", ".jpg", ".jpeg", ".png", ".gif", ".webp"]}
              onUploadStarted={handleUploadStarted}
            />
            <div className="mt-4 flex justify-between">
              <div className="flex items-center text-xs text-muted-foreground">
                <FileImage className="h-3 w-3 mr-1" />
                <span>JPG, PNG, GIF, WebP, etc.</span>
              </div>
              <UploadButton
                variant="outline"
                size="sm"
                multiple={true}
                maxSize={MAX_FILE_SIZE}
                accept="image/*"
                onUploadStarted={handleUploadStarted}
              >
                Browse Images
              </UploadButton>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-4">
            <UploadDropzone
              multiple={true}
              maxSize={MAX_FILE_SIZE}
              accept={["video/*", ".mp4", ".mov", ".avi", ".webm"]}
              onUploadStarted={handleUploadStarted}
            />
            <div className="mt-4 flex justify-between">
              <div className="flex items-center text-xs text-muted-foreground">
                <FileVideo className="h-3 w-3 mr-1" />
                <span>MP4, MOV, AVI, WebM, etc.</span>
              </div>
              <UploadButton
                variant="outline"
                size="sm"
                multiple={true}
                maxSize={MAX_FILE_SIZE}
                accept="video/*"
                onUploadStarted={handleUploadStarted}
              >
                Browse Videos
              </UploadButton>
            </div>
          </TabsContent>

          <TabsContent value="audio" className="mt-4">
            <UploadDropzone
              multiple={true}
              maxSize={MAX_FILE_SIZE}
              accept={["audio/*", ".mp3", ".wav", ".ogg", ".m4a"]}
              onUploadStarted={handleUploadStarted}
            />
            <div className="mt-4 flex justify-between">
              <div className="flex items-center text-xs text-muted-foreground">
                <Music className="h-3 w-3 mr-1" />
                <span>MP3, WAV, OGG, M4A, etc.</span>
              </div>
              <UploadButton
                variant="outline"
                size="sm"
                multiple={true}
                maxSize={MAX_FILE_SIZE}
                accept="audio/*"
                onUploadStarted={handleUploadStarted}
              >
                Browse Audio
              </UploadButton>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
