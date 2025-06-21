"""
Telegram bot for YouTube playlist generator
"""
import logging
import re
import asyncio
from typing import List
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    filters,
    ContextTypes,
)

from .playlist_core import PlaylistGenerator
from .config import get_settings
from .youtube_auth import YouTubeAuth

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Global settings
settings = get_settings()


class YouTubePlaylistBot:
    def __init__(self):
        self.settings = settings
        self.allowed_users = set(settings.get_allowed_telegram_users())
        
        # Initialize playlist generator with OAuth
        self.playlist_generator = PlaylistGenerator(
            youtube_api_key=settings.youtube_api_key,
            openai_api_key=settings.openai_api_key,
            use_oauth=True
        )
        
        # User states for tracking ongoing operations
        self.user_states = {}
    
    def is_authorized(self, user_id: int) -> bool:
        """Check if user is authorized to use the bot"""
        return not self.allowed_users or user_id in self.allowed_users
    
    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle /start command"""
        user = update.effective_user
        
        if not self.is_authorized(user.id):
            await update.message.reply_text(
                "❌ Sorry, you are not authorized to use this bot."
            )
            return
        
        welcome_message = (
            f"👋 Welcome {user.first_name}!\n\n"
            "I'm your YouTube Playlist Generator bot. Just send me YouTube URLs "
            "and I'll create a playlist for you!\n\n"
            "📝 *How to use:*\n"
            "• Send me YouTube video URLs (one or multiple)\n"
            "• I'll extract the videos and create a playlist\n"
            "• You'll get a link to your new playlist!\n\n"
            "🎯 *Commands:*\n"
            "/start - Show this message\n"
            "/help - Get detailed help\n"
            "/stats - Show your statistics\n"
            "/history - Show recent playlists\n\n"
            "Let's create some awesome playlists! 🎵"
        )
        
        await update.message.reply_text(welcome_message, parse_mode='Markdown')
    
    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle /help command"""
        if not self.is_authorized(update.effective_user.id):
            return
        
        help_text = (
            "🤖 *YouTube Playlist Generator Help*\n\n"
            "*Supported URL formats:*\n"
            "• youtube.com/watch?v=VIDEO_ID\n"
            "• youtu.be/VIDEO_ID\n"
            "• youtube.com/shorts/VIDEO_ID\n"
            "• m.youtube.com/watch?v=VIDEO_ID\n\n"
            "*Examples:*\n"
            "Send me messages like:\n"
            "```\n"
            "https://youtube.com/watch?v=dQw4w9WgXcQ\n"
            "https://youtu.be/9bZkp7q19f0\n"
            "```\n\n"
            "*Features:*\n"
            "• AI-generated playlist titles\n"
            "• Automatic video validation\n"
            "• Support for up to 50 videos per playlist\n"
            "• Private/unlisted playlist options\n\n"
            "*Tips:*\n"
            "• Send multiple URLs at once for bigger playlists\n"
            "• Invalid or private videos will be skipped\n"
            "• Playlists are created as 'unlisted' by default"
        )
        
        await update.message.reply_text(help_text, parse_mode='Markdown')
    
    async def stats_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle /stats command"""
        if not self.is_authorized(update.effective_user.id):
            return
        
        # TODO: Implement stats from database
        await update.message.reply_text(
            "📊 *Your Statistics*\n\n"
            "Feature coming soon! Will show:\n"
            "• Total playlists created\n"
            "• Total videos added\n"
            "• Most used video sources\n"
            "• Creation history",
            parse_mode='Markdown'
        )
    
    async def history_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle /history command"""
        if not self.is_authorized(update.effective_user.id):
            return
        
        # TODO: Implement history from database
        await update.message.reply_text(
            "📜 *Recent Playlists*\n\n"
            "Feature coming soon! Will show your last 5 playlists.",
            parse_mode='Markdown'
        )
    
    def extract_urls(self, text: str) -> List[str]:
        """Extract YouTube URLs from text"""
        # Regex pattern for YouTube URLs
        youtube_pattern = r'(?:https?://)?(?:www\.)?(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/shorts/|m\.youtube\.com/watch\?v=)[\w-]+'
        urls = re.findall(youtube_pattern, text)
        
        # Ensure URLs have https://
        formatted_urls = []
        for url in urls:
            if not url.startswith('http'):
                url = 'https://' + url
            formatted_urls.append(url)
        
        return formatted_urls
    
    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle text messages containing YouTube URLs"""
        user = update.effective_user
        
        if not self.is_authorized(user.id):
            return
        
        message_text = update.message.text
        urls = self.extract_urls(message_text)
        
        if not urls:
            await update.message.reply_text(
                "🤔 I couldn't find any YouTube URLs in your message.\n"
                "Please send me YouTube video links to create a playlist!"
            )
            return
        
        # Send initial response
        status_message = await update.message.reply_text(
            f"🔍 Found {len(urls)} URL(s). Processing...",
            parse_mode='Markdown'
        )
        
        try:
            # Create playlist
            await status_message.edit_text("🎬 Creating your playlist...")
            
            result = await self.playlist_generator.create_playlist(
                video_urls=urls,
                custom_title=None,  # Let AI generate title
                description=f"Playlist created via Telegram by {user.first_name}"
            )
            
            if result.success:
                # Build success message
                message = (
                    f"✅ *Playlist Created Successfully!*\n\n"
                    f"📋 *Title:* {result.title}\n"
                    f"🔗 *Link:* {result.playlist_url}\n"
                    f"📹 *Videos added:* {result.video_count}\n"
                )
                
                if result.videos_skipped:
                    message += f"⚠️ *Videos skipped:* {len(result.videos_skipped)}\n"
                    for video in result.videos_skipped[:3]:  # Show max 3 errors
                        message += f"  • {video.error}\n"
                    if len(result.videos_skipped) > 3:
                        message += f"  • ...and {len(result.videos_skipped) - 3} more\n"
                
                await status_message.edit_text(message, parse_mode='Markdown')
                
                # Log success
                logger.info(
                    f"Created playlist '{result.title}' for user {user.id} ({user.username})"
                )
                
            else:
                await status_message.edit_text(
                    f"❌ *Failed to create playlist*\n\n"
                    f"Error: {result.error}",
                    parse_mode='Markdown'
                )
                
        except Exception as e:
            logger.error(f"Error creating playlist: {e}")
            await status_message.edit_text(
                "❌ An error occurred while creating your playlist. Please try again later.",
                parse_mode='Markdown'
            )
    
    async def error_handler(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle errors"""
        logger.error(f"Update {update} caused error {context.error}")
        
        if update and update.effective_message:
            await update.effective_message.reply_text(
                "❌ An error occurred. Please try again later."
            )


def main():
    """Start the bot"""
    # Check if token is configured
    if not settings.telegram_token or settings.telegram_token == "your_telegram_bot_token_here":
        logger.error("Telegram bot token not configured in .env file!")
        return
    
    # Create bot instance
    bot = YouTubePlaylistBot()
    
    # Create application
    application = Application.builder().token(settings.telegram_token).build()
    
    # Add command handlers
    application.add_handler(CommandHandler("start", bot.start))
    application.add_handler(CommandHandler("help", bot.help_command))
    application.add_handler(CommandHandler("stats", bot.stats_command))
    application.add_handler(CommandHandler("history", bot.history_command))
    
    # Add message handler for YouTube URLs
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, bot.handle_message))
    
    # Add error handler
    application.add_error_handler(bot.error_handler)
    
    # Start the bot
    logger.info("Starting YouTube Playlist Bot...")
    logger.info(f"Authorized users: {settings.get_allowed_telegram_users()}")
    
    application.run_polling()


if __name__ == '__main__':
    main()