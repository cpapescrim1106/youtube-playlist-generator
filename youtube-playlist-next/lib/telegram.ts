export class TelegramBot {
  private token: string
  private allowedUserId: number | null

  constructor(token: string, allowedUserId?: string) {
    this.token = token
    this.allowedUserId = allowedUserId ? parseInt(allowedUserId) : null
  }

  isAuthorized(userId: number): boolean {
    return !this.allowedUserId || userId === this.allowedUserId
  }

  extractUrls(text: string): string[] {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const matches = text.match(urlRegex) || []
    return matches.filter(url => 
      url.includes('youtube.com') || 
      url.includes('youtu.be')
    )
  }

  async sendMessage(chatId: number, text: string, parseMode?: 'Markdown' | 'HTML') {
    const url = `https://api.telegram.org/bot${this.token}/sendMessage`
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: parseMode,
          disable_web_page_preview: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error sending Telegram message:', error)
      throw error
    }
  }

  async sendTypingAction(chatId: number) {
    const url = `https://api.telegram.org/bot${this.token}/sendChatAction`
    
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          action: 'typing',
        }),
      })
    } catch (error) {
      console.error('Error sending typing action:', error)
    }
  }

  formatPlaylistMessage(title: string, url: string, videoCount: number): string {
    return `✅ *Playlist Created Successfully!*

📝 *Title:* ${this.escapeMarkdown(title)}
🎬 *Videos:* ${videoCount}
🔗 *Link:* [Open Playlist](${url})

Enjoy your playlist! 🎵`
  }

  formatErrorMessage(error: string): string {
    return `❌ *Error Creating Playlist*

${this.escapeMarkdown(error)}

Please try again or contact support if the issue persists.`
  }

  formatUnauthorizedMessage(): string {
    return '❌ Sorry, you are not authorized to use this bot.'
  }

  formatWelcomeMessage(firstName: string): string {
    return `👋 Welcome ${this.escapeMarkdown(firstName)}!

I'm your YouTube Playlist Generator bot. Just send me YouTube URLs and I'll create a playlist for you!

📝 *How to use:*
• Send me YouTube video URLs (one or multiple)
• I'll extract the videos and create a playlist
• You'll get a link to your new playlist!

🎯 *Commands:*
/start - Show this message
/help - Get detailed help
/stats - Show your statistics

Let's create some awesome playlists! 🎵`
  }

  formatHelpMessage(): string {
    return `🤖 *YouTube Playlist Generator Help*

*Supported URL formats:*
• youtube.com/watch?v=VIDEO_ID
• youtu.be/VIDEO_ID
• youtube.com/shorts/VIDEO_ID
• m.youtube.com/watch?v=VIDEO_ID

*Examples:*
Send me messages like:
\`\`\`
https://youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/9bZkp7q19f0
\`\`\`

*Features:*
• AI-generated playlist titles
• Automatic video validation
• Support for up to 200 videos per playlist
• Private playlist history

*Tips:*
• Send multiple URLs at once
• Mix different video types
• Check your stats with /stats`
  }

  formatStatsMessage(stats: any): string {
    return `📊 *Your Statistics*

📚 *Total Playlists:* ${stats.totalPlaylists}
🎬 *Total Videos:* ${stats.totalVideos}
📅 *Playlists Today:* ${stats.playlistsToday}
📏 *Average Playlist Size:* ${stats.averagePlaylistSize} videos

${stats.mostCommonVideos.length > 0 ? `
🏆 *Most Added Videos:*
${stats.mostCommonVideos.slice(0, 5).map((v: any, i: number) => 
  `${i + 1}. ${this.escapeMarkdown(v.videoTitle)} (${v.count}x)`
).join('\n')}` : ''}

Keep creating awesome playlists! 🎵`
  }

  private escapeMarkdown(text: string): string {
    return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&')
  }
}