import { PlaylistCreator } from "@/components/playlist-creator"
import { Youtube } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Youtube className="h-10 w-10 text-red-600" />
          <h1 className="text-4xl font-bold">YouTube Playlist Generator</h1>
        </div>
        <p className="text-muted-foreground mb-4">
          Create YouTube playlists instantly with AI-generated titles
        </p>
        <Link href="/history">
          <Button variant="outline" size="sm">
            View History & Stats
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <PlaylistCreator />
      </div>

      <div className="mt-12 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-semibold">1</span>
              </div>
              <h3 className="font-medium text-center">Add Videos</h3>
              <p className="text-sm text-muted-foreground text-center">
                Paste YouTube URLs one at a time or in bulk. We&apos;ll validate each video automatically.
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-semibold">2</span>
              </div>
              <h3 className="font-medium text-center">Choose Settings</h3>
              <p className="text-sm text-muted-foreground text-center">
                Set your privacy preference and optionally add a custom title, or let AI create one.
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-semibold">3</span>
              </div>
              <h3 className="font-medium text-center">Get Your Playlist</h3>
              <p className="text-sm text-muted-foreground text-center">
                Your playlist is created instantly on YouTube with a shareable link.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>✨ AI-powered titles • 🔒 Privacy controls • 📊 Track your playlists</p>
          <p>Sign in with Google to create playlists on your YouTube account</p>
        </div>
      </div>
    </div>
  )
}
