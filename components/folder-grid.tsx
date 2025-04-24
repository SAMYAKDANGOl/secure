"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Folder, MoreVertical, Share2, Trash2 } from "lucide-react"

export interface FolderItem {
  id: number
  name: string
  files: number
  size: string
}

interface FolderGridProps {
  folders: FolderItem[]
  title?: string
  emptyMessage?: string
}

export function FolderGrid({ folders, title = "Folders", emptyMessage = "No folders found" }: FolderGridProps) {
  if (folders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Folder className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">{emptyMessage}</h3>
        <p className="text-muted-foreground mt-2">Create a folder to organize your files</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {folders.map((folder) => (
          <Card key={folder.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <Link href={`/dashboard/folder/${folder.id}`} className="group">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                    <Folder className="h-5 w-5" />
                  </div>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/share/${folder.id}?type=folder`}>
                        <Share2 className="mr-2 h-4 w-4" />
                        <span>Share</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link href={`/dashboard/folder/${folder.id}`} className="block mt-3 group">
                <h3 className="font-medium group-hover:text-primary transition-colors">{folder.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {folder.files} files · {folder.size}
                </p>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
