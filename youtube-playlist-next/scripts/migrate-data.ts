#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import { existsSync, copyFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

async function migrate() {
  console.log('🔄 Starting data migration...')
  
  try {
    // Check if old database exists
    const oldDbPath = join(process.cwd(), '../youtube_playlists.db')
    const newDbPath = join(process.cwd(), 'youtube_playlists.db')
    
    if (existsSync(oldDbPath) && !existsSync(newDbPath)) {
      console.log('📂 Copying existing database...')
      copyFileSync(oldDbPath, newDbPath)
      console.log('✅ Database copied successfully')
    }
    
    // Run Prisma migrations
    console.log('🔧 Running database migrations...')
    await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`)
    
    // Check if we need to add new columns
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE playlists ADD COLUMN userId TEXT;
      `)
      console.log('✅ Added userId column to playlists table')
    } catch (e) {
      // Column might already exist
    }
    
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE playlists ADD COLUMN aiGenerated BOOLEAN DEFAULT false;
      `)
      console.log('✅ Added aiGenerated column to playlists table')
    } catch (e) {
      // Column might already exist
    }
    
    // Verify data integrity
    const playlistCount = await prisma.playlist.count()
    console.log(`✅ Found ${playlistCount} existing playlists`)
    
    console.log('✨ Migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

migrate()