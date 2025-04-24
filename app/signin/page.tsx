"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle, Smartphone } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { signIn, verifyTwoFactor } from "@/lib/auth"

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validate inputs
    if (!email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      // Call the authentication function
      const result = await signIn(email, password, rememberMe)

      if (result.success) {
        if (result.user?.twoFactorEnabled) {
          // If 2FA is enabled, show the verification form
          setRequiresTwoFactor(true)
          setIsLoading(false)
        } else {
          // Otherwise, proceed with login
          setSuccess(true)
          // Redirect after a short delay to show success message
          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
        }
      } else {
        setError(result.message || "Invalid email or password")
        setIsLoading(false)
      }
    } catch (err) {
      setError("An error occurred during sign in. Please try again.")
      console.error("Sign in error:", err)
      setIsLoading(false)
    }
  }

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code")
      setIsLoading(false)
      return
    }

    try {
      const result = await verifyTwoFactor(email, verificationCode)

      if (result.success) {
        setSuccess(true)
        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        setError(result.message || "Invalid verification code")
        setIsLoading(false)
      }
    } catch (err) {
      setError("An error occurred during verification. Please try again.")
      console.error("Two-factor verification error:", err)
      setIsLoading(false)
    }
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
            <Link href="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="border-muted/60 shadow-lg overflow-hidden">
            <div className="absolute h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent top-0 left-0 right-0"></div>
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center">
                {requiresTwoFactor ? "Two-Factor Authentication" : "Welcome back"}
              </CardTitle>
              <CardDescription className="text-center">
                {requiresTwoFactor
                  ? "Enter the verification code from your authenticator app"
                  : "Sign in to access your secure files"}
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
                  <AlertDescription>Sign in successful! Redirecting...</AlertDescription>
                </Alert>
              </div>
            )}

            {!requiresTwoFactor ? (
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="pr-10 focus-visible:ring-primary/50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading || success}
                        aria-describedby={error ? "email-error" : undefined}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                        tabIndex={isLoading ? -1 : 0}
                      >
                        Forgot password?
                      </Link>
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
                        aria-describedby={error ? "password-error" : undefined}
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
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me for 30 days
                    </label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col pt-0">
                  <Button
                    className="w-full relative group overflow-hidden"
                    type="submit"
                    disabled={isLoading || success}
                  >
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
                          Signing in...
                        </>
                      ) : success ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Success!
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </span>
                    <span className="absolute inset-0 bg-white/20 translate-y-[102%] group-hover:translate-y-0 transition-transform duration-300"></span>
                  </Button>

                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      href="/signup"
                      className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium"
                      tabIndex={isLoading ? -1 : 0}
                    >
                      Sign up
                    </Link>
                  </p>
                </CardFooter>
              </form>
            ) : (
              <form onSubmit={handleTwoFactorSubmit}>
                <CardContent className="space-y-4">
                  <div className="text-center mb-4">
                    <Smartphone className="h-12 w-12 mx-auto mb-2 text-primary" />
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
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>For demo purposes, use code: 123456</AlertDescription>
                  </Alert>
                </CardContent>

                <CardFooter className="flex flex-col pt-0">
                  <Button
                    className="w-full relative group overflow-hidden"
                    type="submit"
                    disabled={isLoading || success}
                  >
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
                          Verifying...
                        </>
                      ) : success ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Success!
                        </>
                      ) : (
                        "Verify"
                      )}
                    </span>
                    <span className="absolute inset-0 bg-white/20 translate-y-[102%] group-hover:translate-y-0 transition-transform duration-300"></span>
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
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
    </div>
  )
}
