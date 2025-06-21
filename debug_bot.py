#!/usr/bin/env python3
"""
Debug version of the Telegram bot to troubleshoot issues
"""
import sys
import os
import logging

# Add src to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from src.config import get_settings

# Set up detailed logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.DEBUG
)
logger = logging.getLogger(__name__)

settings = get_settings()


async def debug_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Debug handler that logs all messages"""
    user = update.effective_user
    message = update.message
    
    logger.info(f"Message received from user: {user.id} ({user.username})")
    logger.info(f"User first name: {user.first_name}")
    logger.info(f"Message text: {message.text}")
    logger.info(f"Allowed users: {settings.get_allowed_telegram_users()}")
    logger.info(f"User authorized: {user.id in settings.get_allowed_telegram_users()}")
    
    # Always respond with debug info
    debug_message = (
        f"🔍 Debug Info:\n\n"
        f"Your User ID: `{user.id}`\n"
        f"Your Username: @{user.username}\n"
        f"Authorized: {'✅ Yes' if user.id in settings.get_allowed_telegram_users() else '❌ No'}\n"
        f"Allowed IDs: {settings.get_allowed_telegram_users()}\n\n"
        f"Message received: {message.text[:50]}..."
    )
    
    await update.message.reply_text(debug_message, parse_mode='Markdown')


def main():
    """Run the debug bot"""
    if not settings.telegram_token or settings.telegram_token == "your_telegram_bot_token_here":
        logger.error("Telegram bot token not configured!")
        return
    
    # Create application
    application = Application.builder().token(settings.telegram_token).build()
    
    # Add debug handler for all messages
    application.add_handler(MessageHandler(filters.ALL, debug_handler))
    
    logger.info("Starting DEBUG bot...")
    logger.info(f"Bot token: {settings.telegram_token[:20]}...")
    logger.info(f"Allowed users: {settings.get_allowed_telegram_users()}")
    
    application.run_polling()


if __name__ == '__main__':
    main()