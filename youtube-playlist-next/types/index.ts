export interface Playlist {
  id: string
  youtubeId: string
  title: string
  description?: string | null
  url: string
  videoCount: number
  createdBy: string
  createdAt: Date
  userIdentifier?: string | null
  metadata?: string | null
}

export interface PlaylistVideo {
  id: number
  playlistId: string
  videoId: string
  videoTitle?: string | null
  videoChannel?: string | null
  videoDuration?: string | null
  position: number
  addedAt: Date
}

export interface VideoValidationResult {
  valid: boolean
  videoId?: string
  title?: string
  channel?: string
  duration?: string
  error?: string
}

export interface PlaylistCreateRequest {
  urls: string[]
  title?: string
  description?: string
  privacy?: 'public' | 'unlisted' | 'private'
}

export interface PlaylistCreateResponse {
  success: boolean
  playlistId?: string
  youtubeId?: string
  title?: string
  url?: string
  videoCount?: number
  error?: string
}

export interface Statistics {
  totalPlaylists: number
  totalVideos: number
  playlistsToday: number
  averagePlaylistSize: number
  mostCommonVideos: Array<{
    videoId: string
    videoTitle: string
    count: number
  }>
}

export interface TelegramWebhookUpdate {
  update_id: number
  message?: {
    message_id: number
    from: {
      id: number
      is_bot: boolean
      first_name: string
      username?: string
    }
    chat: {
      id: number
      type: string
    }
    date: number
    text?: string
  }
}