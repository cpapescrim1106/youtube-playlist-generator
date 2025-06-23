import dynamic from "next/dynamic"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlaylistHistorySkeleton } from "@/components/playlist-history-skeleton"
import { StatsDashboardSkeleton } from "@/components/stats-dashboard-skeleton"

const PlaylistHistory = dynamic(() => import("@/components/playlist-history").then(mod => ({ default: mod.PlaylistHistory })), {
  loading: () => <PlaylistHistorySkeleton />,
})

const StatsDashboard = dynamic(() => import("@/components/stats-dashboard").then(mod => ({ default: mod.StatsDashboard })), {
  loading: () => <StatsDashboardSkeleton />,
})

export default function HistoryPage() {
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          View your playlist history and statistics
        </p>
      </div>

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="space-y-6">
          <PlaylistHistory />
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-6">
          <StatsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}