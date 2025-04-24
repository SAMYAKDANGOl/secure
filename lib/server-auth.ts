import { cookies } from "next/headers"

export function getServerAuthToken(): string | undefined {
  const cookieStore = cookies()
  return cookieStore.get("auth_token")?.value
}

export function isServerAuthenticated(): boolean {
  return !!getServerAuthToken()
}
