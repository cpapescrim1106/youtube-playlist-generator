import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { YouTubeClient } from '@/lib/youtube'
import { generatePlaylistTitle, generatePlaylistDescription } from '@/lib/openai'
import { 
  handleError, 
  createErrorResponse, 
  ValidationError,
  AuthenticationError,
  handleYouTubeError 
} from '@/lib/errors'
import { PlaylistCreateRequest, PlaylistCreateResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    // Check if user is authenticated for OAuth operations
    const useOAuth = !!session?.accessToken
    
    const body: PlaylistCreateRequest = await request.json()
    const { urls, title, description, privacy = 'unlisted' } = body

    // Validate input
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      throw new ValidationError('No video URLs provided')
    }

    if (urls.length > 200) {
      throw new ValidationError('Maximum 200 videos allowed per playlist')
    }

    // Initialize YouTube client
    const youtube = new YouTubeClient(process.env.YOUTUBE_API_KEY!)
    if (useOAuth && session.accessToken) {
      youtube.setOAuthClient(session.accessToken)
    }

    // Extract video IDs
    const videoIds = youtube.extractVideoIds(urls)
    if (videoIds.length === 0) {
      throw new ValidationError('No valid YouTube video IDs found')
    }

    // Validate videos
    const validationResults = await youtube.validateVideos(videoIds)
    const validVideos = validationResults.filter(v => v.valid)
    
    if (validVideos.length === 0) {
      throw new ValidationError('No valid videos found. All videos might be private or unavailable.')
    }

    // Generate title if not provided
    const playlistTitle = title || await generatePlaylistTitle(
      validVideos.map(v => v.title || 'Untitled')
    )

    // Generate description if not provided
    const playlistDescription = description || await generatePlaylistDescription(
      validVideos.map(v => v.title || 'Untitled'),
      playlistTitle
    )

    // Authentication is required to create playlists
    if (!useOAuth) {
      return NextResponse.json(
        createErrorResponse(new AuthenticationError('You must be signed in with Google to create YouTube playlists')),
        { status: 401 }
      )
    }

    let youtubeId: string
    let playlistUrl: string
    let addedCount = 0

    // Create playlist on YouTube
    try {
      const playlist = await youtube.createPlaylist(playlistTitle, playlistDescription, privacy)
      youtubeId = playlist.id
      playlistUrl = playlist.url

      // Add videos to playlist
      for (let i = 0; i < validVideos.length; i++) {
        const success = await youtube.addVideoToPlaylist(playlist.id, validVideos[i].videoId!, i)
        if (success) {
          addedCount++
        } else {
          console.error(`Failed to add video ${validVideos[i].videoId} to playlist at position ${i}`)
        }
        
        // Add a small delay between requests to avoid rate limiting
        if (i < validVideos.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      
      if (addedCount === 0) {
        throw new Error('Failed to add any videos to the playlist')
      }
    } catch (error) {
      throw handleYouTubeError(error)
    }

    // Save to database - temporarily simplified response due to Prisma error
    console.log(`Playlist created successfully: ${playlistUrl}`)
    console.log(`Added ${addedCount} out of ${validVideos.length} videos`)
    
    const response: PlaylistCreateResponse = {
      success: true,
      playlistId: youtubeId,
      youtubeId: youtubeId,
      title: playlistTitle,
      url: playlistUrl,
      videoCount: addedCount,
    }

    return NextResponse.json(response)
  } catch (error) {
    const appError = handleError(error)
    return NextResponse.json(
      createErrorResponse(appError),
      { status: appError.statusCode }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')
    const includeVideos = searchParams.get('includeVideos') === 'true'

    const session = await auth()
    const userIdentifier = session?.user?.email || 
                         searchParams.get('user') || 
                         request.headers.get('x-forwarded-for')

    const where = userIdentifier ? { userIdentifier } : {}

    const playlists = await prisma.playlist.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: includeVideos ? {
        videos: {
          orderBy: { position: 'asc' }
        }
      } : undefined,
    })

    const total = await prisma.playlist.count({ where })

    return NextResponse.json({
      playlists,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    const appError = handleError(error)
    return NextResponse.json(
      createErrorResponse(appError),
      { status: appError.statusCode }
    )
  }
}