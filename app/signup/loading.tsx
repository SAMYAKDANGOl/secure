export default function SignUpLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-full blur-sm opacity-70 animate-pulse"></div>
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Loading sign-up page...</p>
      </div>
    </div>
  )
}
