"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileArchive, FileImage, FileText, FileVideo, Link2, Mail, Shield, Users } from "lucide-react"
import type { FileItem } from "./file-grid"
import type { FolderItem } from "./folder-grid"
import { toast } from "@/components/ui/use-toast"

interface FileSharingProps {
  item: FileItem | FolderItem
  type: "file" | "folder"
}

export function FileSharing({ item, type }: FileSharingProps) {
  const [email, setEmail] = useState("")
  const [permission, setPermission] = useState("view")
  const [isPublic, setIsPublic] = useState(false)
  const [expiryDate, setExpiryDate] = useState("")
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [password, setPassword] = useState("")
  const [shareLink, setShareLink] = useState("")

  const getItemIcon = () => {
    if (type === "folder") return <Shield className="h-5 w-5" />

    const fileItem = item as FileItem
    switch (fileItem.type) {
      case "document":
      case "spreadsheet":
      case "presentation":
        return <FileText className="h-5 w-5" />
      case "image":
        return <FileImage className="h-5 w-5" />
      case "video":
        return <FileVideo className="h-5 w-5" />
      case "archive":
        return <FileArchive className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    toast({
      title: "Invitation sent",
      description: `Invitation sent to ${email} with ${permission} permission.`,
    })

    setEmail("")
  }

  const handleGenerateLink = () => {
    const baseUrl = window.location.origin
    const randomId = Math.random().toString(36).substring(2, 10)
    const newShareLink = `${baseUrl}/share/${randomId}`
    setShareLink(newShareLink)

    toast({
      title: "Share link generated",
      description: "The link has been copied to your clipboard.",
    })

    navigator.clipboard.writeText(newShareLink)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
    toast({
      title: "Link copied",
      description: "The share link has been copied to your clipboard.",
    })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            {getItemIcon()}
          </div>
          <div>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>
              {type === "folder"
                ? `${(item as FolderItem).files} files · ${(item as FolderItem).size}`
                : `${(item as FileItem).size} · ${(item as FileItem).modified}`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="people">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="people">
              <Users className="h-4 w-4 mr-2" />
              Share with people
            </TabsTrigger>
            <TabsTrigger value="link">
              <Link2 className="h-4 w-4 mr-2" />
              Get share link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="people" className="space-y-4">
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={permission} onValueChange={setPermission}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">Can view</SelectItem>
                      <SelectItem value="comment">Can comment</SelectItem>
                      <SelectItem value="edit">Can edit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" disabled={!email}>
                <Mail className="h-4 w-4 mr-2" />
                Send invite
              </Button>
            </form>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">People with access</h3>
              <div className="text-sm text-muted-foreground">Only you have access to this {type}</div>
            </div>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public-access">Public access</Label>
                  <p className="text-xs text-muted-foreground">Anyone with the link can access this {type}</p>
                </div>
                <Switch id="public-access" checked={isPublic} onCheckedChange={setIsPublic} />
              </div>

              {isPublic && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="expiry-date">Expiry date (optional)</Label>
                    <Input
                      id="expiry-date"
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="password-protection">Password protection</Label>
                      <p className="text-xs text-muted-foreground">Require a password to access this {type}</p>
                    </div>
                    <Switch
                      id="password-protection"
                      checked={isPasswordProtected}
                      onCheckedChange={setIsPasswordProtected}
                    />
                  </div>

                  {isPasswordProtected && (
                    <div className="grid gap-2 pt-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter a password"
                      />
                    </div>
                  )}

                  <div className="pt-2">
                    {shareLink ? (
                      <div className="space-y-2">
                        <Label htmlFor="share-link">Share link</Label>
                        <div className="flex gap-2">
                          <Input id="share-link" value={shareLink} readOnly className="flex-1" />
                          <Button variant="outline" onClick={handleCopyLink}>
                            Copy
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button onClick={handleGenerateLink}>Generate link</Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
