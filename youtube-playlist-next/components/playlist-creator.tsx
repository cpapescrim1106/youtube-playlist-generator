"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"
import { VideoInput } from "@/components/video-input"
import { PlaylistSuccess } from "@/components/playlist-success"
import { Youtube, Sparkles, Lock, Globe, Eye, LogIn } from "lucide-react"
import { PlaylistCreateResponse } from "@/types"
import { signIn } from "next-auth/react"

interface PlaylistCreatorProps {
  onSuccess?: (playlist: PlaylistCreateResponse) => void
}

export function PlaylistCreator({ onSuccess }: PlaylistCreatorProps) {
  const { data: session } = useSession()
  const [urls, setUrls] = useState<string[]>([])
  const [customTitle, setCustomTitle] = useState("")
  const [privacy, setPrivacy] = useState<"public" | "unlisted" | "private">("unlisted")
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<PlaylistCreateResponse | null>(null)
  const [validationResults, setValidationResults] = useState<any>(null)

  const handleValidate = async (urlList: string[]) => {
    if (urlList.length === 0) {
      setValidationResults(null)
      return
    }

    setValidating(true)
    try {
      const response = await fetch("/api/videos/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: urlList }),
      })

      const data = await response.json()
      setValidationResults(data)
    } catch (err) {
      console.error("Validation error:", err)
    } finally {
      setValidating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (urls.length === 0) {
      setError("Please add at least one YouTube URL")
      return
    }

    setLoading(true)
    setError("")
    setSuccess(null)

    try {
      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urls,
          title: customTitle || undefined,
          privacy,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to create playlist")
      }

      // Check if playlist was actually created on YouTube
      if (!data.url || data.url === "#") {
        throw new Error("Playlist was not created on YouTube. Please sign in with Google first.")
      }

      setSuccess(data)
      setUrls([])
      setCustomTitle("")
      setValidationResults(null)
      onSuccess?.(data)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const privacyOptions = [
    { value: "public", label: "Public", icon: Globe, description: "Anyone can search for and view" },
    { value: "unlisted", label: "Unlisted", icon: Eye, description: "Anyone with the link can view" },
    { value: "private", label: "Private", icon: Lock, description: "Only you can view" },
  ]

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <VideoInput
          urls={urls}
          onUrlsChange={(newUrls) => {
            setUrls(newUrls)
            handleValidate(newUrls)
          }}
          validating={validating}
          validationResults={validationResults}
        />

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Playlist Title (Optional)
            </label>
            <div className="relative">
              <input
                id="title"
                type="text"
                className="w-full p-3 pr-10 rounded-md border border-input bg-background"
                placeholder="Leave empty for AI-generated title"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                disabled={loading}
              />
              <Sparkles className="absolute right-3 top-3.5 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              We&apos;ll create a creative title using AI if you leave this empty
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Privacy Setting</label>
            <div className="grid grid-cols-3 gap-3">
              {privacyOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`p-3 rounded-md border transition-colors text-center ${
                      privacy === option.value
                        ? "border-primary bg-primary/10"
                        : "border-input hover:border-muted-foreground"
                    }`}
                    onClick={() => setPrivacy(option.value as any)}
                    disabled={loading}
                  >
                    <Icon className="h-4 w-4 mx-auto mb-1" />
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        {!session ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-yellow-600/50 bg-yellow-600/10">
              <p className="text-sm text-center">
                You need to sign in with Google to create YouTube playlists
              </p>
            </div>
            <Button
              type="button"
              className="w-full"
              size="lg"
              onClick={() => signIn("google")}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
          </div>
        ) : (
          <Button
            type="submit"
            className="w-full"
            disabled={loading || urls.length === 0}
            size="lg"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Creating Playlist...
              </>
            ) : (
              <>
                <Youtube className="mr-2 h-5 w-5" />
                Create Playlist
              </>
            )}
          </Button>
        )}
      </form>

      {success && (
        <PlaylistSuccess
          playlist={success}
          onClose={() => setSuccess(null)}
        />
      )}
    </div>
  )
}