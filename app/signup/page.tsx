"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info,
  Check,
  Lock,
  Smartphone,
  ChevronRight,
  FileText,
  Share2,
  Cloud,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [accountType, setAccountType] = useState("personal")
  const [company, setCompany] = useState("")
  const [enableTwoFactor, setEnableTwoFactor] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // If on step 1, validate and move to step 2
    if (currentStep === 1) {
      // Validate inputs
      if (!firstName || !lastName || !email || !password) {
        setError("Please fill in all required fields")
        return
      }

      // Validate password strength
      if (passwordStrength < 60) {
        setError("Please choose a stronger password")
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address")
        return
      }

      // If 2FA is enabled, move to step 2, otherwise proceed with signup
      if (enableTwoFactor) {
        setCurrentStep(2)
        // In a real app, this would be an API call to generate a QR code
        setQrCodeUrl("/placeholder.svg?height=200&width=200")
        return
      }
    }

    // If on step 2 (2FA setup) or skipping 2FA
    setIsLoading(true)

    try {
      // Validate verification code if 2FA is enabled
      if (enableTwoFactor && currentStep === 2) {
        if (!verificationCode || verificationCode.length !== 6) {
          setError("Please enter a valid 6-digit verification code")
          setIsLoading(false)
          return
        }

        // In a real app, you would verify the code with your backend
        if (verificationCode !== "123456") {
          // Demo verification code
          setError("Invalid verification code. Please try again.")
          setIsLoading(false)
          return
        }
      }

      // Call the registration API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          accountType,
          company: accountType === "business" ? company : undefined,
          twoFactorEnabled: enableTwoFactor,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push("/signin")
        }, 1500)
      } else {
        setError(data.error || "Failed to create account")
        setIsLoading(false)
      }
    } catch (err) {
      setError("An error occurred during sign up. Please try again.")
      console.error("Sign up error:", err)
      setIsLoading(false)
    }
  }

  // Password strength indicators
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

  // Calculate password strength percentage
  const calculatePasswordStrength = () => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (hasUppercase) strength += 25
    if (hasNumber) strength += 25
    if (hasSpecialChar) strength += 25
    return strength
  }

  const passwordStrength = calculatePasswordStrength()

  // Get strength color
  const getStrengthColor = () => {
    if (passwordStrength < 50) return "text-destructive"
    if (passwordStrength < 75) return "text-amber-500"
    return "text-green-500"
  }

  // Get progress color
  const getProgressColor = () => {
    if (passwordStrength < 50) return "bg-destructive"
    if (passwordStrength < 75) return "bg-amber-500"
    return "bg-green-500"
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      {/* Header with navigation */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <Shield className="h-6 w-6 text-primary relative" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              VaultGuard
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#security" className="text-sm font-medium hover:text-primary transition-colors">
              Security
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="border-muted/60 shadow-lg overflow-hidden">
            <div className="absolute h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent top-0 left-0 right-0"></div>
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center">Create your VaultGuard account</CardTitle>
              <CardDescription className="text-center">
                {currentStep === 1
                  ? "Sign up to start storing your files securely"
                  : "Set up two-factor authentication"}
              </CardDescription>
            </CardHeader>

            {error && (
              <div className="px-6">
                <Alert variant="destructive" className="mb-4 text-sm animate-in fade-in-50 slide-in-from-top-5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            {success && (
              <div className="px-6">
                <Alert className="mb-4 text-sm border-green-500 text-green-500 bg-green-500/10 animate-in fade-in-50 slide-in-from-top-5">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Account created successfully! Redirecting to sign in...</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Step indicator */}
            {enableTwoFactor && (
              <div className="px-6 mb-6">
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    1
                  </div>
                  <div className={`flex-1 h-0.5 mx-2 ${currentStep === 2 ? "bg-primary" : "bg-muted"}`}></div>
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    2
                  </div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Account details</span>
                  <span>Security setup</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {currentStep === 1 ? (
                <>
                  <Tabs defaultValue="personal" className="px-6 mb-4" onValueChange={setAccountType}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="personal" disabled={isLoading || success}>
                        Personal
                      </TabsTrigger>
                      <TabsTrigger value="business" disabled={isLoading || success}>
                        Business
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="personal" className="pt-4">
                      <div className="text-sm text-muted-foreground">For individual use. Get 10GB free storage.</div>
                    </TabsContent>
                    <TabsContent value="business" className="pt-4">
                      <div className="text-sm text-muted-foreground">
                        For teams and businesses. Advanced security features included.
                      </div>
                    </TabsContent>
                  </Tabs>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name" className="text-sm font-medium">
                          First name
                        </Label>
                        <Input
                          id="first-name"
                          placeholder="John"
                          className="focus-visible:ring-primary/50"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          disabled={isLoading || success}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name" className="text-sm font-medium">
                          Last name
                        </Label>
                        <Input
                          id="last-name"
                          placeholder="Doe"
                          className="focus-visible:ring-primary/50"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          disabled={isLoading || success}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="focus-visible:ring-primary/50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading || success}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">
                          Password
                        </Label>
                        <span className={`text-xs font-medium ${getStrengthColor()}`}>
                          {password ? (passwordStrength < 50 ? "Weak" : passwordStrength < 75 ? "Good" : "Strong") : ""}
                        </span>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10 focus-visible:ring-primary/50"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isLoading || success}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading || success}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>

                      {/* Password strength meter */}
                      {password && (
                        <div className="space-y-2 animate-in fade-in-50">
                          <Progress
                            value={passwordStrength}
                            className="h-1.5"
                            indicatorClassName={getProgressColor()}
                          />

                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div
                              className={`flex items-center gap-1.5 ${hasMinLength ? "text-green-500" : "text-muted-foreground"}`}
                            >
                              {hasMinLength ? <Check className="h-3.5 w-3.5" /> : <Info className="h-3.5 w-3.5" />}
                              <span>At least 8 characters</span>
                            </div>
                            <div
                              className={`flex items-center gap-1.5 ${hasUppercase ? "text-green-500" : "text-muted-foreground"}`}
                            >
                              {hasUppercase ? <Check className="h-3.5 w-3.5" /> : <Info className="h-3.5 w-3.5" />}
                              <span>Uppercase letter</span>
                            </div>
                            <div
                              className={`flex items-center gap-1.5 ${hasNumber ? "text-green-500" : "text-muted-foreground"}`}
                            >
                              {hasNumber ? <Check className="h-3.5 w-3.5" /> : <Info className="h-3.5 w-3.5" />}
                              <span>Number</span>
                            </div>
                            <div
                              className={`flex items-center gap-1.5 ${hasSpecialChar ? "text-green-500" : "text-muted-foreground"}`}
                            >
                              {hasSpecialChar ? <Check className="h-3.5 w-3.5" /> : <Info className="h-3.5 w-3.5" />}
                              <span>Special character</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {accountType === "business" && (
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-sm font-medium">
                          Company name
                        </Label>
                        <Input
                          id="company"
                          placeholder="Your company"
                          className="focus-visible:ring-primary/50"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          disabled={isLoading || success}
                        />
                      </div>
                    )}

                    {/* Two-factor authentication toggle */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-factor" className="text-sm font-medium">
                          Two-factor authentication
                        </Label>
                        <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Switch
                              id="two-factor"
                              checked={enableTwoFactor}
                              onCheckedChange={setEnableTwoFactor}
                              disabled={isLoading || success}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Recommended for enhanced security</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="pt-2">
                      <Alert className="text-xs bg-muted/50 border-muted">
                        <Lock className="h-4 w-4" />
                        <AlertDescription>
                          Your data will be encrypted with military-grade encryption and stored securely.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </>
              ) : (
                // Step 2: Two-factor authentication setup
                <CardContent className="space-y-4">
                  <div className="text-center mb-4">
                    <Smartphone className="h-12 w-12 mx-auto mb-2 text-primary" />
                    <h3 className="text-lg font-medium">Set up authenticator app</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)
                    </p>
                  </div>

                  <div className="flex justify-center mb-4">
                    <div className="border p-2 rounded-md bg-white">
                      <img
                        src={qrCodeUrl || "/placeholder.svg"}
                        alt="QR Code for authenticator app"
                        width={200}
                        height={200}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="verification-code" className="text-sm font-medium">
                      Verification code
                    </Label>
                    <Input
                      id="verification-code"
                      placeholder="Enter 6-digit code"
                      className="focus-visible:ring-primary/50 text-center tracking-widest"
                      value={verificationCode}
                      onChange={(e) => {
                        // Only allow numbers and limit to 6 digits
                        const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
                        setVerificationCode(value)
                      }}
                      required
                      disabled={isLoading || success}
                    />
                    <p className="text-xs text-muted-foreground">Enter the 6-digit code from your authenticator app</p>
                  </div>

                  <Alert className="text-xs bg-muted/50 border-muted">
                    <Info className="h-4 w-4" />
                    <AlertDescription>For demo purposes, use code: 123456</AlertDescription>
                  </Alert>
                </CardContent>
              )}

              <CardFooter className="flex flex-col pt-0">
                <Button className="w-full relative group overflow-hidden" type="submit" disabled={isLoading || success}>
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {currentStep === 1 ? "Creating account..." : "Verifying..."}
                      </>
                    ) : success ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Success!
                      </>
                    ) : (
                      <>
                        {currentStep === 1
                          ? enableTwoFactor
                            ? "Continue to security setup"
                            : "Create account"
                          : "Complete setup"}
                        {currentStep === 1 && enableTwoFactor && <ChevronRight className="ml-2 h-4 w-4" />}
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-white/20 translate-y-[102%] group-hover:translate-y-0 transition-transform duration-300"></span>
                </Button>

                {currentStep === 2 && (
                  <Button
                    variant="ghost"
                    className="mt-2"
                    onClick={() => setCurrentStep(1)}
                    type="button"
                    disabled={isLoading || success}
                  >
                    Back to account details
                  </Button>
                )}

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium"
                    tabIndex={isLoading ? -1 : 0}
                  >
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <a href="#" className="hover:underline text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="hover:underline text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>

      {/* Feature highlights */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-8">Why choose VaultGuard?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-background p-6 rounded-xl shadow-sm border border-muted hover:border-primary/20 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">End-to-End Encryption</h3>
              <p className="text-sm text-muted-foreground">
                Your files are encrypted before they leave your device, ensuring maximum privacy.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl shadow-sm border border-muted hover:border-primary/20 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Smart Organization</h3>
              <p className="text-sm text-muted-foreground">
                Intelligent file categorization and powerful search capabilities.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl shadow-sm border border-muted hover:border-primary/20 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Secure Sharing</h3>
              <p className="text-sm text-muted-foreground">
                Share files with customizable permissions and expiring links.
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl shadow-sm border border-muted hover:border-primary/20 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Cloud className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Access Anywhere</h3>
              <p className="text-sm text-muted-foreground">Access your files from any device, anywhere in the world.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
