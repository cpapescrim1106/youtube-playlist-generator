#!/usr/bin/env python3
"""
Simple script to get your Telegram user ID
"""
import os
import sys
from dotenv import load_dotenv

# Add src to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

print("🔍 Get Your Telegram User ID")
print("=" * 40)
print("\nTo get your Telegram user ID:")
print("\n1. Go to Telegram and search for: @userinfobot")
print("2. Start a chat with the bot")
print("3. It will reply with your user info including your ID")
print("\n4. Update your .env file:")
print("   ALLOWED_TELEGRAM_USER_ID=your_id_here")
print("\nAlternatively, search for @RawDataBot and forward any message to it.")
print("\nYour current configured ID:", os.getenv('ALLOWED_TELEGRAM_USER_ID', 'Not set'))