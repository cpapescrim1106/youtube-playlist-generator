import { useState, useEffect } from "react"

interface Playlist {
  id: string
  playlistId: string
  title: string
  videoCount: number
  privacy: string
  url?: string
  createdAt: string
  userId?: string
  aiGenerated?: boolean
}

interface UsePlaylists {
  playlists: Playlist[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function usePlaylists(limit: number = 10): UsePlaylists {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlaylists = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/playlists?limit=${limit}`)
      if (!response.ok) {
        throw new Error("Failed to fetch playlists")
      }
      
      const data = await response.json()
      setPlaylists(data.playlists || [])
    } catch (err: any) {
      setError(err.message || "Failed to load playlists")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlaylists()
  }, [limit])

  return {
    playlists,
    loading,
    error,
    refresh: fetchPlaylists,
  }
}