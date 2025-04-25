"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function ApiDocsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">API Documentation</h1>
        <p className="text-muted-foreground">
          Learn how to use the VaultGuard API to access your files programmatically
        </p>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          To use the API, you need to create an API key in the{" "}
          <a href="/dashboard/api-keys" className="font-medium underline">
            API Keys
          </a>{" "}
          section.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="authentication">
        <TabsList className="mb-4">
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
          <TabsTrigger value="sharing">Sharing</TabsTrigger>
        </TabsList>

        <TabsContent value="authentication">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>How to authenticate with the VaultGuard API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                All API requests must include your API key in the Authorization header using the Bearer token format:
              </p>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>Authorization: Bearer vg_your_api_key_here</code>
              </pre>

              <h3 className="text-lg font-medium mt-4">Example Request</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>{`curl -X GET https://your-domain.com/api/files \\
  -H "Authorization: Bearer vg_your_api_key_here" \\
  -H "Content-Type: application/json"`}</code>
              </pre>

              <h3 className="text-lg font-medium mt-4">Error Responses</h3>
              <p>If authentication fails, you'll receive a 401 Unauthorized response:</p>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>{`{
  "error": "Unauthorized"
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Files API</CardTitle>
              <CardDescription>Endpoints for managing files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">List Files</h3>
                <p className="mb-2">Get a list of all files or files in a specific folder.</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`GET /api/files
GET /api/files?folderId={folderId}`}</code>
                </pre>

                <h4 className="text-md font-medium mt-4 mb-2">Query Parameters</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <code>folderId</code> (optional) - ID of the folder to list files from
                  </li>
                  <li>
                    <code>type</code> (optional) - Filter files by type (e.g., document, image)
                  </li>
                  <li>
                    <code>starred</code> (optional) - Set to "true" to show only starred files
                  </li>
                </ul>

                <h4 className="text-md font-medium mt-4 mb-2">Response</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`[
  {
    "id": "file_123",
    "name": "document.pdf",
    "type": "document",
    "size": "2.4 MB",
    "sizeInBytes": 2516582,
    "isStarred": false,
    "folderId": "folder_456",
    "createdAt": "2023-04-15T10:30:00Z",
    "updatedAt": "2023-04-15T10:30:00Z",
    "modified": "Apr 15, 2023, 10:30 AM"
  },
  ...
]`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Get File</h3>
                <p className="mb-2">Get details about a specific file.</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>GET /api/files/{"{fileId}"}</code>
                </pre>

                <h4 className="text-md font-medium mt-4 mb-2">Response</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "id": "file_123",
  "name": "document.pdf",
  "type": "document",
  "size": "2.4 MB",
  "sizeInBytes": 2516582,
  "isStarred": false,
  "folderId": "folder_456",
  "createdAt": "2023-04-15T10:30:00Z",
  "updatedAt": "2023-04-15T10:30:00Z",
  "modified": "Apr 15, 2023, 10:30 AM",
  "downloadUrl": "https://..."
}`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Upload File</h3>
                <p className="mb-2">Upload a new file.</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>POST /api/files</code>
                </pre>

                <h4 className="text-md font-medium mt-4 mb-2">Request Body (multipart/form-data)</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <code>file</code> (required) - The file to upload
                  </li>
                  <li>
                    <code>folderId</code> (optional) - ID of the folder to upload to
                  </li>
                </ul>

                <h4 className="text-md font-medium mt-4 mb-2">Response</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "id": "file_123",
  "name": "document.pdf",
  "type": "document",
  "size": "2.4 MB",
  "sizeInBytes": 2516582,
  "isStarred": false,
  "folderId": "folder_456",
  "createdAt": "2023-04-15T10:30:00Z",
  "updatedAt": "2023-04-15T10:30:00Z",
  "modified": "Apr 15, 2023, 10:30 AM"
}`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Delete File</h3>
                <p className="mb-2">Delete a file.</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>DELETE /api/files/{"{fileId}"}</code>
                </pre>

                <h4 className="text-md font-medium mt-4 mb-2">Response</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "success": true
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="folders">
          <Card>
            <CardHeader>
              <CardTitle>Folders API</CardTitle>
              <CardDescription>Endpoints for managing folders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">List Folders</h3>
                <p className="mb-2">Get a list of all folders or subfolders.</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`GET /api/folders
GET /api/folders?parentId={parentId}`}</code>
                </pre>

                <h4 className="text-md font-medium mt-4 mb-2">Query Parameters</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <code>parentId</code> (optional) - ID of the parent folder to list subfolders from
                  </li>
                  <li>
                    <code>starred</code> (optional) - Set to "true" to show only starred folders
                  </li>
                </ul>

                <h4 className="text-md font-medium mt-4 mb-2">Response</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`[
  {
    "id": "folder_123",
    "name": "Documents",
    "parentId": null,
    "isStarred": false,
    "createdAt": "2023-04-15T10:30:00Z",
    "updatedAt": "2023-04-15T10:30:00Z",
    "files": 24,
    "size": "128 MB"
  },
  ...
]`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Create Folder</h3>
                <p className="mb-2">Create a new folder.</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>POST /api/folders</code>
                </pre>

                <h4 className="text-md font-medium mt-4 mb-2">Request Body</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "name": "New Folder",
  "parentId": "folder_456" // optional
}`}</code>
                </pre>

                <h4 className="text-md font-medium mt-4 mb-2">Response</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "id": "folder_123",
  "name": "New Folder",
  "parentId": "folder_456",
  "isStarred": false,
  "createdAt": "2023-04-15T10:30:00Z",
  "updatedAt": "2023-04-15T10:30:00Z",
  "files": 0,
  "size": "0 B"
}`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Delete Folder</h3>
                <p className="mb-2">Delete a folder and all its contents.</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>DELETE /api/folders/{"{folderId}"}</code>
                </pre>

                <h4 className="text-md font-medium mt-4 mb-2">Response</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "success": true
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sharing">
          <Card>
            <CardHeader>
              <CardTitle>Sharing API</CardTitle>
              <CardDescription>Endpoints for sharing files and folders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Share File</h3>
                <p className="mb-2">Create a share link for a file.</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>POST /api/files/{"{fileId}"}/share</code>
                </pre>

                <h4 className="text-md font-medium mt-4 mb-2">Request Body</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "email": "user@example.com", // optional
  "permission": "view", // view, edit
  "expiresAt": "2023-05-15T10:30:00Z" // optional
}`}</code>
                </pre>

                <h4 className="text-md font-medium mt-4 mb-2">Response</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "id": "share_123",
  "accessCode": "abc123def456",
  "shareUrl": "https://your-domain.com/share/file/abc123def456"
}`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Share Folder</h3>
                <p className="mb-2">Create a share link for a folder.</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>POST /api/folders/{"{folderId}"}/share</code>
                </pre>

                <h4 className="text-md font-medium mt-4 mb-2">Request Body</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "email": "user@example.com", // optional
  "permission": "view", // view, edit
  "expiresAt": "2023-05-15T10:30:00Z" // optional
}`}</code>
                </pre>

                <h4 className="text-md font-medium mt-4 mb-2">Response</h4>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`{
  "id": "share_123",
  "accessCode": "abc123def456",
  "shareUrl": "https://your-domain.com/share/folder/abc123def456"
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
