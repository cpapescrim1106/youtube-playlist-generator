import { google } from 'googleapis'
import { VideoValidationResult } from '@/types'

const youtube = google.youtube('v3')

export class YouTubeClient {
  private apiKey: string
  private oauth2Client?: any

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  setOAuthClient(accessToken: string) {
    this.oauth2Client = new google.auth.OAuth2()
    this.oauth2Client.setCredentials({ access_token: accessToken })
  }

  async validateVideos(videoIds: string[]): Promise<VideoValidationResult[]> {
    const results: VideoValidationResult[] = []
    
    // YouTube API allows up to 50 video IDs per request
    for (let i = 0; i < videoIds.length; i += 50) {
      const batch = videoIds.slice(i, i + 50)
      
      try {
        const response = await youtube.videos.list({
          key: this.apiKey,
          part: ['snippet', 'status', 'contentDetails'],
          id: batch,
        })

        const foundIds = new Set(response.data.items?.map(item => item.id) || [])
        
        // Process found videos
        response.data.items?.forEach(item => {
          const isPrivate = item.status?.privacyStatus === 'private'
          const isEmbeddable = item.status?.embeddable !== false
          
          results.push({
            valid: !isPrivate && isEmbeddable,
            videoId: item.id!,
            title: item.snippet?.title || 'Unknown',
            channel: item.snippet?.channelTitle || 'Unknown',
            duration: item.contentDetails?.duration || 'Unknown',
            error: isPrivate ? 'Video is private' : !isEmbeddable ? 'Video is not embeddable' : undefined
          })
        })
        
        // Process not found videos
        batch.forEach(videoId => {
          if (!foundIds.has(videoId)) {
            results.push({
              valid: false,
              videoId,
              error: 'Video not found'
            })
          }
        })
      } catch (error: any) {
        console.error('YouTube API error:', error)
        batch.forEach(videoId => {
          results.push({
            valid: false,
            videoId,
            error: error.message || 'API error'
          })
        })
      }
    }
    
    return results
  }

  async createPlaylist(title: string, description: string, privacy: 'public' | 'unlisted' | 'private' = 'unlisted') {
    if (!this.oauth2Client) {
      throw new Error('OAuth client not set. Call setOAuthClient first.')
    }

    try {
      const response = await youtube.playlists.insert({
        auth: this.oauth2Client,
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title,
            description,
          },
          status: {
            privacyStatus: privacy,
          },
        },
      })

      return {
        id: response.data.id!,
        title: response.data.snippet?.title || title,
        url: `https://www.youtube.com/playlist?list=${response.data.id}`,
      }
    } catch (error: any) {
      console.error('Error creating playlist:', error)
      throw new Error(error.message || 'Failed to create playlist')
    }
  }

  async addVideoToPlaylist(playlistId: string, videoId: string, position?: number) {
    if (!this.oauth2Client) {
      throw new Error('OAuth client not set. Call setOAuthClient first.')
    }

    try {
      await youtube.playlistItems.insert({
        auth: this.oauth2Client,
        part: ['snippet'],
        requestBody: {
          snippet: {
            playlistId,
            resourceId: {
              kind: 'youtube#video',
              videoId,
            },
            position,
          },
        },
      })
      return true
    } catch (error: any) {
      console.error('Error adding video to playlist:', {
        playlistId,
        videoId,
        position,
        error: error.response?.data || error.message || error
      })
      return false
    }
  }

  extractVideoIds(urls: string[]): string[] {
    const videoIds: string[] = []
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([\w-]+)/,
      /youtube\.com\/.*[?&]v=([\w-]+)/,
    ]
    
    urls.forEach(url => {
      const trimmedUrl = url.trim()
      let videoId: string | null = null
      
      // Try regex patterns
      for (const pattern of patterns) {
        const match = trimmedUrl.match(pattern)
        if (match) {
          videoId = match[1]
          break
        }
      }
      
      // Fallback: parse URL
      if (!videoId) {
        try {
          const parsed = new URL(trimmedUrl)
          if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
            videoId = parsed.searchParams.get('v')
          }
        } catch {
          // Invalid URL
        }
      }
      
      if (videoId && !videoIds.includes(videoId)) {
        videoIds.push(videoId)
      }
    })
    
    return videoIds
  }
}