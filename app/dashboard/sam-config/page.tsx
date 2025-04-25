import { SamStatus } from "@/components/sam-status"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Shield, Key, Lock } from "lucide-react"

export default function SamConfigPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">SAM Configuration</h1>
        <p className="text-muted-foreground">Manage your Secure Access Management (SAM) settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SamStatus />

        <Card>
          <CardHeader>
            <CardTitle>SAM Information</CardTitle>
            <CardDescription>About Secure Access Management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The Secure Access Management (SAM) system provides enhanced security features for your file storage. It
              manages access control, encryption keys, and security policies.
            </p>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                SAM configuration is managed through environment variables and can only be accessed on the server.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="access">Access Control</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>SAM Overview</CardTitle>
                <CardDescription>Key features and capabilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <Shield className="h-8 w-8 text-primary mb-2" />
                    <h3 className="text-lg font-medium mb-1">Enhanced Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Military-grade encryption and security protocols for your files
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <Key className="h-8 w-8 text-primary mb-2" />
                    <h3 className="text-lg font-medium mb-1">Access Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Fine-grained access control for users and applications
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <Lock className="h-8 w-8 text-primary mb-2" />
                    <h3 className="text-lg font-medium mb-1">Compliance</h3>
                    <p className="text-sm text-muted-foreground">
                      Meet regulatory requirements with audit logs and compliance features
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>SAM security configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Security settings are managed through environment variables and can only be configured by
                  administrators.
                </p>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-md font-medium mb-1">Encryption</h3>
                    <p className="text-sm text-muted-foreground">
                      AES-256 encryption is used for all files stored in the system
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="text-md font-medium mb-1">Key Rotation</h3>
                    <p className="text-sm text-muted-foreground">
                      Encryption keys are automatically rotated according to your security policy
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="text-md font-medium mb-1">Audit Logging</h3>
                    <p className="text-sm text-muted-foreground">
                      All access and operations are logged for security auditing
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
                <CardDescription>SAM access management</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Access control policies determine who can access your files and what operations they can perform.
                </p>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-md font-medium mb-1">Role-Based Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Users are assigned roles that determine their access permissions
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="text-md font-medium mb-1">API Access</h3>
                    <p className="text-sm text-muted-foreground">API keys can be restricted based on SAM policies</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="text-md font-medium mb-1">IP Restrictions</h3>
                    <p className="text-sm text-muted-foreground">
                      Access can be limited to specific IP addresses or ranges
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
