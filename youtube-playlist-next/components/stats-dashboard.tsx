"use client"

import { TrendingUp, Video, PlayCircle, Calendar, BarChart3 } from "lucide-react"
import { ErrorMessage } from "@/components/error-message"
import { StatsDashboardSkeleton } from "@/components/stats-dashboard-skeleton"
import { useStats } from "@/hooks/use-stats"

export function StatsDashboard() {
  const { stats, loading, error } = useStats()

  if (loading) {
    return <StatsDashboardSkeleton />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (!stats) {
    return null
  }

  const statCards = [
    {
      label: "Total Playlists",
      value: stats.totalPlaylists,
      icon: PlayCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
    },
    {
      label: "Total Videos",
      value: stats.totalVideos,
      icon: Video,
      color: "text-green-600",
      bgColor: "bg-green-600/10",
    },
    {
      label: "This Week",
      value: stats.playlistsThisWeek,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-600/10",
    },
    {
      label: "This Month",
      value: stats.playlistsThisMonth,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-600/10",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Statistics</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          )
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Playlist Insights</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Videos per Playlist</span>
              <span className="font-medium">{stats.averageVideosPerPlaylist.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Most Used Privacy</span>
              <span className="font-medium capitalize">{stats.mostUsedPrivacy}</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Title Generation</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">AI Generated Titles</span>
              <span className="font-medium">{stats.aiGeneratedCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Custom Titles</span>
              <span className="font-medium">{stats.userGeneratedCount}</span>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-3 w-20 bg-primary/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${(stats.aiGeneratedCount / (stats.aiGeneratedCount + stats.userGeneratedCount)) * 100}%`,
                    }}
                  />
                </div>
                <span>
                  {((stats.aiGeneratedCount / (stats.aiGeneratedCount + stats.userGeneratedCount)) * 100).toFixed(0)}% AI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}