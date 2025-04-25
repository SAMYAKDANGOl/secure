"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle, Copy, Key, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ApiKey {
  id: string
  name: string
  permissions: string[]
  expiresAt: string | null
  lastUsed: string | null
  createdAt: string
  key?: string // Only present when a new key is created
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(["read"])
  const [newKeyExpiry, setNewKeyExpiry] = useState<string>("")
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/api-keys")
      if (!response.ok) {
        throw new Error("Failed to fetch API keys")
      }
      const data = await response.json()
      setApiKeys(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      toast({
        title: "Error",
        description: "Failed to fetch API keys",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createApiKey = async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (!newKeyName) {
        setError("API key name is required")
        return
      }

      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newKeyName,
          permissions: newKeyPermissions,
          expiresAt: newKeyExpiry ? new Date(newKeyExpiry).toISOString() : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create API key")
      }

      const newKey = await response.json()
      setApiKeys([newKey, ...apiKeys])
      setNewlyCreatedKey(newKey.key)

      // Reset form
      setNewKeyName("")
      setNewKeyPermissions(["read"])
      setNewKeyExpiry("")

      toast({
        title: "Success",
        description: "API key created successfully",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteApiKey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete API key")
      }

      setApiKeys(apiKeys.filter((key) => key.id !== id))

      toast({
        title: "Success",
        description: "API key deleted successfully",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    })
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleString()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">API Keys</h1>
        <p className="text-muted-foreground">Manage API keys for programmatic access to your files</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          API keys allow secure programmatic access to your files and folders.
        </p>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>Create a new API key for programmatic access to your files.</DialogDescription>
            </DialogHeader>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {newlyCreatedKey && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="flex flex-col gap-2">
                  <p>Your API key has been created. Copy it now as it won't be shown again.</p>
                  <div className="flex items-center gap-2 p-2 bg-green-100 rounded-md">
                    <code className="text-xs font-mono break-all">{newlyCreatedKey}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(newlyCreatedKey)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="My API Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label>Permissions</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="read"
                      checked={newKeyPermissions.includes("read")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewKeyPermissions([...newKeyPermissions, "read"])
                        } else {
                          setNewKeyPermissions(newKeyPermissions.filter((p) => p !== "read"))
                        }
                      }}
                    />
                    <label
                      htmlFor="read"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Read (view files and folders)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="write"
                      checked={newKeyPermissions.includes("write")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewKeyPermissions([...newKeyPermissions, "write"])
                        } else {
                          setNewKeyPermissions(newKeyPermissions.filter((p) => p !== "write"))
                        }
                      }}
                    />
                    <label
                      htmlFor="write"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Write (upload and modify files)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="delete"
                      checked={newKeyPermissions.includes("delete")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewKeyPermissions([...newKeyPermissions, "delete"])
                        } else {
                          setNewKeyPermissions(newKeyPermissions.filter((p) => p !== "delete"))
                        }
                      }}
                    />
                    <label
                      htmlFor="delete"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Delete (remove files and folders)
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="expiry">Expiry Date (Optional)</Label>
                <Input id="expiry" type="date" value={newKeyExpiry} onChange={(e) => setNewKeyExpiry(e.target.value)} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createApiKey} disabled={isLoading || !newKeyName}>
                {isLoading ? "Creating..." : "Create API Key"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {apiKeys.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Key className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No API Keys</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              You haven't created any API keys yet. API keys allow secure programmatic access to your files.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <Card key={apiKey.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{apiKey.name}</CardTitle>
                    <CardDescription>Created {formatDate(apiKey.createdAt)}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    onClick={() => deleteApiKey(apiKey.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Permissions:</span>
                    <span className="font-medium">{apiKey.permissions.join(", ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="font-medium">{apiKey.expiresAt ? formatDate(apiKey.expiresAt) : "Never"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last used:</span>
                    <span className="font-medium">{apiKey.lastUsed ? formatDate(apiKey.lastUsed) : "Never"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
