import { CheckCircle, ExternalLink, Copy, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PlaylistCreateResponse } from "@/types"
import { useState } from "react"

interface PlaylistSuccessProps {
  playlist: PlaylistCreateResponse
  onClose: () => void
}

export function PlaylistSuccess({ playlist, onClose }: PlaylistSuccessProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (playlist.url && playlist.url !== "#") {
      await navigator.clipboard.writeText(playlist.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="rounded-lg border border-green-600/50 bg-green-600/10 p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-green-600/20 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
        
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-green-600">
              Playlist Created Successfully!
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your playlist has been created with {playlist.videoCount} videos
            </p>
          </div>
          
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium">Title:</span>
              <p className="text-sm text-muted-foreground">{playlist.title}</p>
            </div>
            
            {playlist.url && playlist.url !== "#" && (
              <div className="flex items-center gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => window.open(playlist.url, "_blank")}
                  className="gap-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open on YouTube
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  <Copy className="h-3 w-3" />
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}