"use client"

import { useState } from "react"
import { History, ExternalLink, Calendar, Video, ChevronDown, ChevronUp, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ErrorMessage } from "@/components/error-message"
import { PlaylistHistorySkeleton } from "@/components/playlist-history-skeleton"
import { formatDistanceToNow } from "date-fns"
import { usePlaylists } from "@/hooks/use-playlists"

export function PlaylistHistory() {
  const { playlists, loading, error, refresh } = usePlaylists(10)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await refresh()
    setRefreshing(false)
  }

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (loading) {
    return <PlaylistHistorySkeleton />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (playlists.length === 0) {
    return (
      <div className="text-center py-12">
        <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No playlists yet</h3>
        <p className="text-muted-foreground">
          Your created playlists will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <History className="h-6 w-6" />
          Recent Playlists
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            "Refresh"
          )}
        </Button>
      </div>

      <div className="space-y-3">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{playlist.title}</h3>
                  {playlist.aiGenerated && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      AI Generated
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    {playlist.videoCount} videos
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(new Date(playlist.createdAt), { addSuffix: true })}
                  </span>
                  <span className="capitalize">{playlist.privacy}</span>
                </div>

                {expandedId === playlist.id && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm space-y-2">
                      <div>
                        <span className="font-medium">Playlist ID:</span>{" "}
                        <code className="bg-muted px-2 py-0.5 rounded text-xs">
                          {playlist.playlistId}
                        </code>
                      </div>
                      {playlist.url && (
                        <div>
                          <span className="font-medium">URL:</span>{" "}
                          <a
                            href={playlist.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {playlist.url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {playlist.url && playlist.url !== "#" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(playlist.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(playlist.id)}
                >
                  {expandedId === playlist.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}