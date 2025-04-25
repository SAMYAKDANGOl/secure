"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Shield,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  Upload,
  Star,
  Clock,
  Folder,
  Share2,
  Menu,
  Key,
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
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { signOut } from "next-auth/react"
import { UploadButton } from "@/components/upload-button"
import { UploadProvider } from "@/contexts/upload-context"
import { UploadModal } from "@/components/upload-modal"
import { Suspense } from "react"
import Loading from "./loading"
import { FileProvider } from "@/contexts/file-context"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [storageUsed, setStorageUsed] = useState(42) // Percentage of storage used
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [folders, setFolders] = useState([
    { id: "1", name: "Documents", files: 24, size: "128 MB" },
    { id: "2", name: "Images", files: 56, size: "2.4 GB" },
    { id: "3", name: "Projects", files: 18, size: "450 MB" },
    { id: "4", name: "Shared with me", files: 7, size: "32 MB" },
  ])

  // Fetch folders on component mount
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch("/api/folders?parentId=null")
        if (response.ok) {
          const data = await response.json()
          setFolders(data)
        }
      } catch (error) {
        console.error("Error fetching folders:", error)
      }
    }

    fetchFolders()
  }, [])

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/signin")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <FileProvider>
      <UploadProvider>
        <div className="min-h-screen flex flex-col bg-background">
          {/* Header */}
          <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <div className="md:hidden">
                  <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                      <div className="flex flex-col h-full">
                        <div className="p-4 border-b">
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
                        <div className="flex-1 overflow-auto p-4">
                          <div className="space-y-1 mb-6">
                            <Button
                              variant={isActive("/dashboard") ? "default" : "ghost"}
                              className="w-full justify-start"
                              asChild
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Link href="/dashboard">
                                <Folder className="mr-2 h-4 w-4" />
                                My Files
                              </Link>
                            </Button>
                            <Button
                              variant={isActive("/dashboard/recent") ? "default" : "ghost"}
                              className="w-full justify-start"
                              asChild
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Link href="/dashboard/recent">
                                <Clock className="mr-2 h-4 w-4" />
                                Recent
                              </Link>
                            </Button>
                            <Button
                              variant={isActive("/dashboard/starred") ? "default" : "ghost"}
                              className="w-full justify-start"
                              asChild
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Link href="/dashboard/starred">
                                <Star className="mr-2 h-4 w-4" />
                                Starred
                              </Link>
                            </Button>
                            <Button
                              variant={isActive("/dashboard/shared") ? "default" : "ghost"}
                              className="w-full justify-start"
                              asChild
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Link href="/dashboard/shared">
                                <Share2 className="mr-2 h-4 w-4" />
                                Shared
                              </Link>
                            </Button>
                            <Button
                              variant={isActive("/dashboard/settings") ? "default" : "ghost"}
                              className="w-full justify-start"
                              asChild
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Link href="/dashboard/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                              </Link>
                            </Button>
                            <Button
                              variant={isActive("/dashboard/api-keys") ? "default" : "ghost"}
                              className="w-full justify-start"
                              asChild
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Link href="/dashboard/api-keys">
                                <Key className="mr-2 h-4 w-4" />
                                API Keys
                              </Link>
                            </Button>
                            <Button
                              variant={isActive("/dashboard/sam-config") ? "default" : "ghost"}
                              className="w-full justify-start"
                              asChild
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Link href="/dashboard/sam-config">
                                <Shield className="mr-2 h-4 w-4" />
                                SAM Config
                              </Link>
                            </Button>
                          </div>

                          <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2 px-3">Folders</h3>
                            <div className="space-y-1">
                              {folders.map((folder) => (
                                <Button
                                  key={folder.id}
                                  variant={isActive(`/dashboard/folder/${folder.id}`) ? "default" : "ghost"}
                                  className="w-full justify-start"
                                  asChild
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  <Link href={`/dashboard/folder/${folder.id}`}>
                                    <Folder className="mr-2 h-4 w-4" />
                                    {folder.name}
                                  </Link>
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border-t">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Storage</span>
                              <span className="font-medium">{storageUsed}% used</span>
                            </div>
                            <Progress value={storageUsed} className="h-2" />
                            <div className="text-xs text-muted-foreground">4.2 GB of 10 GB used</div>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
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
              <form onSubmit={handleSearch} className="hidden md:flex items-center relative max-w-md w-full mx-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files and folders..."
                  className="pl-10 bg-muted/40 border-muted focus-visible:ring-primary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

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
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
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
                <Button variant={isActive("/dashboard") ? "default" : "ghost"} className="w-full justify-start" asChild>
                  <Link href="/dashboard">
                    <Folder className="mr-2 h-4 w-4" />
                    My Files
                  </Link>
                </Button>
                <Button
                  variant={isActive("/dashboard/recent") ? "default" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard/recent">
                    <Clock className="mr-2 h-4 w-4" />
                    Recent
                  </Link>
                </Button>
                <Button
                  variant={isActive("/dashboard/starred") ? "default" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard/starred">
                    <Star className="mr-2 h-4 w-4" />
                    Starred
                  </Link>
                </Button>
                <Button
                  variant={isActive("/dashboard/shared") ? "default" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard/shared">
                    <Share2 className="mr-2 h-4 w-4" />
                    Shared
                  </Link>
                </Button>
                <Button
                  variant={isActive("/dashboard/settings") ? "default" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
                <Button
                  variant={isActive("/dashboard/api-keys") ? "default" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard/api-keys">
                    <Key className="mr-2 h-4 w-4" />
                    API Keys
                  </Link>
                </Button>
                <Button
                  variant={isActive("/dashboard/sam-config") ? "default" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard/sam-config">
                    <Shield className="mr-2 h-4 w-4" />
                    SAM Config
                  </Link>
                </Button>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2 px-3">Folders</h3>
                <div className="space-y-1">
                  {folders.map((folder) => (
                    <Button
                      key={folder.id}
                      variant={isActive(`/dashboard/folder/${folder.id}`) ? "default" : "ghost"}
                      className="w-full justify-start"
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
            <main className="flex-1 p-4 md:p-6 overflow-auto">
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </main>
          </div>
        </div>
        <UploadModal />
      </UploadProvider>
    </FileProvider>
  )
}
