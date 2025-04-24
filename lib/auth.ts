// This is a simplified authentication utility
// In a real application, you would connect this to your backend API

interface SignInResult {
  success: boolean
  message?: string
  token?: string
  user?: {
    id: string
    email: string
    name: string
    twoFactorEnabled?: boolean
  }
}

interface SignUpData {
  firstName: string
  lastName: string
  email: string
  password: string
  accountType: string
  company?: string
  twoFactorEnabled?: boolean
}

interface SignUpResult {
  success: boolean
  message?: string
  user?: {
    id: string
    email: string
    name: string
    twoFactorEnabled?: boolean
  }
}

interface VerifyTwoFactorResult {
  success: boolean
  message?: string
  token?: string
}

// Mock user database for demo purposes
const users: Record<string, any> = {
  "demo@example.com": {
    id: "user_1",
    email: "demo@example.com",
    password: "password", // In a real app, this would be hashed
    firstName: "Demo",
    lastName: "User",
    accountType: "personal",
    twoFactorEnabled: false,
  },
}

export async function signIn(email: string, password: string, rememberMe = false): Promise<SignInResult> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // For demo purposes only - in a real app, this would be an API call
  // NEVER do authentication like this in a production app
  const user = users[email]

  if (user && user.password === password) {
    // If 2FA is enabled, we would return a different response
    if (user.twoFactorEnabled) {
      return {
        success: true,
        message: "Please enter your two-factor authentication code",
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          twoFactorEnabled: true,
        },
      }
    }

    // Set a cookie or localStorage item based on rememberMe preference
    if (rememberMe) {
      // In a real app, you would use a secure HTTP-only cookie
      localStorage.setItem("auth_token", "demo_token_" + Date.now())
    } else {
      // For session-only storage
      sessionStorage.setItem("auth_token", "demo_token_" + Date.now())
    }

    return {
      success: true,
      token: "demo_token",
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    }
  }

  return {
    success: false,
    message: "Invalid email or password",
  }
}

export async function verifyTwoFactor(email: string, code: string): Promise<VerifyTwoFactorResult> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // For demo purposes, we'll accept "123456" as a valid code
  if (code === "123456") {
    // Sett auth token
    localStorage.setItem("auth_token", "demo_token_" + Date.now())

    return {
      success: true,
      token: "demo_token",
      message: "Two-factor authentication successful",
    }
  }

  return {
    success: false,
    message: "Invalid verification code",
  }
}

export async function signUp(data: SignUpData): Promise<SignUpResult> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Check if email already exists
  if (users[data.email]) {
    return {
      success: false,
      message: "An account with this email already exists",
    }
  }

  // In a real app, you would hash the password before storing it
  // Create new user
  const userId = `user_${Object.keys(users).length + 1}`
  users[data.email] = {
    id: userId,
    email: data.email,
    password: data.password, // In a real app, this would be hashed
    firstName: data.firstName,
    lastName: data.lastName,
    accountType: data.accountType,
    company: data.company,
    twoFactorEnabled: data.twoFactorEnabled || false,
  }

  // Set auth token
  localStorage.setItem("auth_token", "demo_token_" + Date.now())

  return {
    success: true,
    user: {
      id: userId,
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      twoFactorEnabled: data.twoFactorEnabled || false,
    },
  }
}

export function signOut(): void {
  // Clear auth data
  localStorage.removeItem("auth_token")
  sessionStorage.removeItem("auth_token")

  // In a real app, you might also want to invalidate the token on the server
}

export function isAuthenticated(): boolean {
  // Check if user is authenticated
  return !!localStorage.getItem("auth_token") || !!sessionStorage.getItem("auth_token")
}

export function generateTwoFactorQRCode(email: string): string {
  // In a real app, this would generate a proper QR code URL for the authenticator app
  // For demo purposes, we'll just return a placeholder
  return "/placeholder.svg?height=200&width=200"
}
