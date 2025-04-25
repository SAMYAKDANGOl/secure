"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function SamStatus() {
  const [status, setStatus] = useState<"loading" | "active" | "error">("loading")
  const [message, setMessage] = useState<string>("Checking SAM configuration...")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const checkSamStatus = async () => {
    setIsRefreshing(true)
    setStatus("loading")
    setMessage("Checking SAM configuration...")

    try {
      const response = await fetch("/api/sam")
      const data = await response.json()

      if (response.ok) {
        setStatus("active")
        setMessage(data.message || "SAM configuration is valid")
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to validate SAM configuration")
      }
    } catch (error) {
      setStatus("error")
      setMessage("An error occurred while checking SAM status")
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    checkSamStatus()
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>SAM Status</CardTitle>
          {status === "active" ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Active
            </Badge>
          ) : status === "error" ? (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Error
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Checking
            </Badge>
          )}
        </div>
        <CardDescription>Secure Access Management Configuration</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "active" ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <p>{message}</p>
          </div>
        ) : status === "error" ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : (
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
            <p>{message}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={checkSamStatus} disabled={isRefreshing} className="w-full">
          {isRefreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Status
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
