import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { handleError, createErrorResponse } from '@/lib/errors'

export async function GET(request: NextRequest) {
  try {
    // For now, return mock data until database is properly set up
    const stats = {
      totalPlaylists: 2,
      totalVideos: 8,
      playlistsThisWeek: 1,
      playlistsThisMonth: 2,
      averageVideosPerPlaylist: 4.0,
      mostUsedPrivacy: 'unlisted',
      aiGeneratedCount: 1,
      userGeneratedCount: 1
    }

    return NextResponse.json(stats)
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}