import { NextRequest, NextResponse } from 'next/server'
import { YouTubeClient } from '@/lib/youtube'
import { handleError, createErrorResponse, ValidationError } from '@/lib/errors'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { urls } = body

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      throw new ValidationError('No video URLs provided')
    }

    if (urls.length > 50) {
      throw new ValidationError('Maximum 50 videos allowed per validation request')
    }

    // Initialize YouTube client
    const youtube = new YouTubeClient(process.env.YOUTUBE_API_KEY!)

    // Extract video IDs
    const videoIds = youtube.extractVideoIds(urls)
    
    if (videoIds.length === 0) {
      throw new ValidationError('No valid YouTube video IDs found')
    }

    // Validate videos
    const validationResults = await youtube.validateVideos(videoIds)

    // Group results
    const validVideos = validationResults.filter(v => v.valid)
    const invalidVideos = validationResults.filter(v => !v.valid)

    return NextResponse.json({
      valid: validVideos.length,
      invalid: invalidVideos.length,
      total: validationResults.length,
      videos: validationResults,
    })
  } catch (error) {
    const appError = handleError(error)
    return NextResponse.json(
      createErrorResponse(appError),
      { status: appError.statusCode }
    )
  }
}

// Allow OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}