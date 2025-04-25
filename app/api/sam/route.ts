import { NextResponse } from "next/server"
import { getSamConfig, validateSamCredentials } from "@/lib/sam-config"

export async function GET() {
  try {
    // Validate SAM credentials
    const validationResult = await validateSamCredentials()

    if (!validationResult.valid) {
      return NextResponse.json({ error: "Invalid SAM credentials" }, { status: 401 })
    }

    // Get SAM configuration
    const samConfig = getSamConfig()

    // Return a sanitized version of the SAM configuration
    // Don't return sensitive information
    return NextResponse.json({
      status: "active",
      message: "SAM configuration is valid",
      samConfigured: !!samConfig,
    })
  } catch (error) {
    console.error("Error accessing SAM configuration:", error)
    return NextResponse.json({ error: "Failed to access SAM configuration" }, { status: 500 })
  }
}
