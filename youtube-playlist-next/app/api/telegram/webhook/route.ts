import { NextRequest, NextResponse } from 'next/server'
import { TelegramBot } from '@/lib/telegram'
import { YouTubeClient } from '@/lib/youtube'
import { generatePlaylistTitle, generatePlaylistDescription } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { handleError, createErrorResponse } from '@/lib/errors'
import { TelegramWebhookUpdate } from '@/types'

const bot = new TelegramBot(
  process.env.TELEGRAM_BOT_TOKEN!,
  process.env.ALLOWED_TELEGRAM_USER_ID
)

export async function POST(request: NextRequest) {
  try {
    const update: TelegramWebhookUpdate = await request.json()
    
    // Only handle message updates
    if (!update.message) {
      return NextResponse.json({ ok: true })
    }

    const { message } = update
    const chatId = message.chat.id
    const userId = message.from.id
    const text = message.text || ''

    // Check authorization
    if (!bot.isAuthorized(userId)) {
      await bot.sendMessage(chatId, bot.formatUnauthorizedMessage())
      return NextResponse.json({ ok: true })
    }

    // Handle commands
    if (text.startsWith('/start')) {
      await bot.sendMessage(
        chatId, 
        bot.formatWelcomeMessage(message.from.first_name),
        'Markdown'
      )
      return NextResponse.json({ ok: true })
    }

    if (text.startsWith('/help')) {
      await bot.sendMessage(chatId, bot.formatHelpMessage(), 'Markdown')
      return NextResponse.json({ ok: true })
    }

    if (text.startsWith('/stats')) {
      const stats = await prisma.$transaction(async (tx) => {
        const userIdentifier = `telegram:${userId}`
        const totalPlaylists = await tx.playlist.count({ 
          where: { userIdentifier } 
        })
        
        const videoCount = await tx.playlistVideo.count({
          where: { 
            playlist: { userIdentifier } 
          }
        })

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const playlistsToday = await tx.playlist.count({
          where: {
            userIdentifier,
            createdAt: { gte: today }
          }
        })

        const avgSize = await tx.playlist.aggregate({
          _avg: { videoCount: true },
          where: { userIdentifier }
        })

        const mostCommon = await tx.$queryRaw<Array<{ videoId: string; videoTitle: string | null; count: bigint }>>`
          SELECT pv.video_id as videoId, pv.video_title as videoTitle, COUNT(*) as count
          FROM playlist_videos pv
          JOIN playlists p ON pv.playlist_id = p.id
          WHERE p.user_identifier = ${userIdentifier}
          GROUP BY pv.video_id, pv.video_title
          ORDER BY count DESC
          LIMIT 5
        `

        return {
          totalPlaylists,
          totalVideos: videoCount,
          playlistsToday,
          averagePlaylistSize: Math.round((avgSize._avg.videoCount || 0) * 100) / 100,
          mostCommonVideos: mostCommon.map(v => ({
            videoId: v.videoId,
            videoTitle: v.videoTitle || 'Unknown',
            count: Number(v.count)
          }))
        }
      })

      await bot.sendMessage(chatId, bot.formatStatsMessage(stats), 'Markdown')
      return NextResponse.json({ ok: true })
    }

    // Extract URLs from message
    const urls = bot.extractUrls(text)
    
    if (urls.length === 0) {
      await bot.sendMessage(
        chatId,
        "🤔 I didn't find any YouTube URLs in your message. Please send me some YouTube video links!",
        'Markdown'
      )
      return NextResponse.json({ ok: true })
    }

    // Send typing indicator
    await bot.sendTypingAction(chatId)

    // Process playlist creation
    try {
      const youtube = new YouTubeClient(process.env.YOUTUBE_API_KEY!)
      
      // Extract and validate video IDs
      const videoIds = youtube.extractVideoIds(urls)
      const validationResults = await youtube.validateVideos(videoIds)
      const validVideos = validationResults.filter(v => v.valid)
      
      if (validVideos.length === 0) {
        await bot.sendMessage(
          chatId,
          bot.formatErrorMessage('No valid videos found. The videos might be private or unavailable.'),
          'Markdown'
        )
        return NextResponse.json({ ok: true })
      }

      // Generate title and description
      const title = await generatePlaylistTitle(
        validVideos.map(v => v.title || 'Untitled')
      )
      const description = await generatePlaylistDescription(
        validVideos.map(v => v.title || 'Untitled'),
        title
      )

      // For Telegram bot, we don't have OAuth, so just save locally
      const playlist = await prisma.playlist.create({
        data: {
          youtubeId: `telegram-${Date.now()}`,
          title,
          description,
          url: '#',
          videoCount: validVideos.length,
          createdBy: 'telegram',
          userIdentifier: `telegram:${userId}`,
          metadata: JSON.stringify({
            telegramUser: {
              id: userId,
              firstName: message.from.first_name,
              username: message.from.username
            }
          }),
          videos: {
            create: validVideos.map((video, index) => ({
              videoId: video.videoId!,
              videoTitle: video.title,
              videoChannel: video.channel,
              videoDuration: video.duration,
              position: index,
            })),
          },
        },
      })

      // Create shareable link
      const playlistUrl = `${process.env.NEXTAUTH_URL}/playlist/${playlist.id}`

      await bot.sendMessage(
        chatId,
        bot.formatPlaylistMessage(title, playlistUrl, validVideos.length),
        'Markdown'
      )
    } catch (error) {
      console.error('Error creating playlist:', error)
      await bot.sendMessage(
        chatId,
        bot.formatErrorMessage('Failed to create playlist. Please try again later.'),
        'Markdown'
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    const appError = handleError(error)
    return NextResponse.json(
      createErrorResponse(appError),
      { status: appError.statusCode }
    )
  }
}

// Telegram webhook verification
export async function GET() {
  return NextResponse.json({ 
    ok: true, 
    webhook: 'YouTube Playlist Generator Bot'
  })
}