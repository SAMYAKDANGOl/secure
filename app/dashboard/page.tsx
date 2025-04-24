"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Shield,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  Upload,
  FolderPlus,
  Grid,
  List,
  Filter,
  File,
  FileText,
  FileImage,
  FileArchive,
  MoreVertical,
  Download,
  Trash2,
  Share2,
  Star,
  Clock,
  Folder,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { signOut } from "@/lib/auth"
import { UploadDialog } from "@/components/upload-dialog"
import { UploadButton } from "@/components/upload-button"
import { UploadProvider } from "@/contexts/upload-context"
import { UploadModal } from "@/components/upload-modal"

// Mock data for files
const recentFiles = [
  {
    id: 1,
    name: "Project Proposal.docx",
    type: "document",
    size: "2.4 MB",
    modified: "Today, 10:30 AM",
    icon: FileText,
  },
  {
    id: 2,
    name: "Presentation.pptx",
    type: "presentation",
    size: "4.8 MB",
    modified: "Yesterday, 2:15 PM",
    icon: FileText,
  },
  { id: 3, name: "Budget.xlsx", type: "spreadsheet", size: "1.2 MB", modified: "Apr 20, 2023", icon: FileText },
  { id: 4, name: "Team Photo.jpg", type: "image", size: "3.6 MB", modified: "Apr 18, 2023", icon: FileImage },
  { id: 5, name: "Project Assets.zip", type: "archive", size: "24.2 MB", modified: "Apr 15, 2023", icon: FileArchive },
]

// Mock data for folders
const folders = [
  { id: 1, name: "Documents", files: 24, size: "128 MB" },
  { id: 2, name: "Images", files: 56, size: "2.4 GB" },
  { id: 3, name: "Projects", files: 18, size: "450 MB" },
  { id: 4, name: "Shared with me", files: 7, size: "32 MB" },
]

export default function DashboardPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [storageUsed, setStorageUsed] = useState(42) // Percentage of storage used

  const handleSignOut = () => {
    signOut()
    router.push("/signin")
  }

  const formatFileSize = (sizeStr: string) => {
    return sizeStr
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return FileText
      case "image":
        return FileImage
      case "archive":
        return FileArchive
      default:
        return File
    }
  }

  return (
    <UploadProvider>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <Shield className="h-6 w-6 text-primary relative" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                  VaultGuard
                </span>
              </Link>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files and folders..."
                className="pl-10 bg-muted/40 border-muted focus-visible:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* User menu */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      JD
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="hidden md:flex flex-col w-64 border-r p-4 bg-muted/20">
            <div className="space-y-1 mb-6">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard">
                  <Folder className="mr-2 h-4 w-4" />
                  My Files
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
                <Link href="/dashboard/recent">
                  <Clock className="mr-2 h-4 w-4" />
                  Recent
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
                <Link href="/dashboard/starred">
                  <Star className="mr-2 h-4 w-4" />
                  Starred
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
                <Link href="/dashboard/shared">
                  <Share2 className="mr-2 h-4 w-4" />
                  Shared
                </Link>
              </Button>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2 px-3">Folders</h3>
              <div className="space-y-1">
                {folders.map((folder) => (
                  <Button
                    key={folder.id}
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground"
                    asChild
                  >
                    <Link href={`/dashboard/folder/${folder.id}`}>
                      <Folder className="mr-2 h-4 w-4" />
                      {folder.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Storage</span>
                  <span className="font-medium">{storageUsed}% used</span>
                </div>
                <Progress value={storageUsed} className="h-2" />
                <div className="text-xs text-muted-foreground">4.2 GB of 10 GB used</div>
              </div>

              <UploadButton className="w-full" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </UploadButton>
            </div>
          </aside>

          {/* Main content area */}
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-1">My Files</h1>
              <p className="text-muted-foreground">Manage and organize your secure files</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <UploadDialog />
                <Button variant="outline">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  New Folder
                </Button>
              </div>

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
                <Button variant="ghost" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Files</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Folders section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Folders</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {folders.map((folder) => (
                  <Card key={folder.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                          <Folder className="h-5 w-5" />
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      <h3 className="font-medium mt-3">{folder.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {folder.files} files · {folder.size}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent files section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Recent Files</h2>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {recentFiles.map((file) => (
                    <Card key={file.id} className="hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                            <file.icon className="h-5 w-5" />
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                <span>Download</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="mr-2 h-4 w-4" />
                                <span>Share</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <h3 className="font-medium mt-3 truncate" title={file.name}>
                          {file.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {file.size} · {file.modified}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
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
                      {recentFiles.map((file, index) => (
                        <tr key={file.id} className={`border-t ${index % 2 === 0 ? "bg-muted/20" : ""}`}>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                                <file.icon className="h-4 w-4" />
                              </div>
                              <span className="font-medium">{file.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{file.type}</td>
                          <td className="py-3 px-4 text-muted-foreground">{file.size}</td>
                          <td className="py-3 px-4 text-muted-foreground">{file.modified}</td>
                          <td className="py-3 px-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  <span>Download</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Share2 className="mr-2 h-4 w-4" />
                                  <span>Share</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      <UploadModal />
    </UploadProvider>
  )
}
