import { GET } from '@/app/api/health/route'
import { NextResponse } from 'next/server'

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    $queryRaw: jest.fn()
  }
}))

describe('/api/health', () => {
  it('returns healthy status when database is connected', async () => {
    const { prisma } = require('@/lib/prisma')
    prisma.$queryRaw.mockResolvedValueOnce([{ '1': 1 }])

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.status).toBe('healthy')
    expect(data.timestamp).toBeDefined()
    expect(data.uptime).toBeDefined()
  })

  it('returns unhealthy status when database connection fails', async () => {
    const { prisma } = require('@/lib/prisma')
    prisma.$queryRaw.mockRejectedValueOnce(new Error('Connection failed'))

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(503)
    expect(data.status).toBe('unhealthy')
    expect(data.error).toBe('Database connection failed')
  })
})