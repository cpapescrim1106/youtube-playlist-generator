#!/usr/bin/env python3
"""
Test the Telegram bot locally
"""
import sys
import os
import logging

# Add src to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.bot import main

if __name__ == "__main__":
    # Set up logging
    logging.basicConfig(
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        level=logging.INFO
    )
    
    print("🤖 Starting YouTube Playlist Telegram Bot...")
    print("Press Ctrl+C to stop\n")
    
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Bot stopped.")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nMake sure you have:")
        print("1. Set TELEGRAM_TOKEN in your .env file")
        print("2. Created the bot with @BotFather")
        print("3. Set ALLOWED_TELEGRAM_USER_ID to your Telegram user ID")