import { useState, useEffect } from "react"

interface Stats {
  totalPlaylists: number
  totalVideos: number
  playlistsThisWeek: number
  playlistsThisMonth: number
  averageVideosPerPlaylist: number
  mostUsedPrivacy: string
  aiGeneratedCount: number
  userGeneratedCount: number
}

interface UseStats {
  stats: Stats | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useStats(): UseStats {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch("/api/stats")
      if (!response.ok) {
        throw new Error("Failed to fetch stats")
      }
      
      const data = await response.json()
      setStats(data)
    } catch (err: any) {
      setError(err.message || "Failed to load statistics")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  }
}