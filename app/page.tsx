import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function HomePage() {
  // Check for auth token in cookies (server-side)
  const cookieStore = cookies()
  const authToken = cookieStore.get("auth_token")?.value

  // Redirect based on authentication status
  if (authToken) {
    redirect("/dashboard")
  } else {
    redirect("/signin")
  }

  // This won't be rendered, but is needed for TypeScript
  return null
}
