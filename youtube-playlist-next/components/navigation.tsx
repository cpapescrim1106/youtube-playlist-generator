"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Youtube, BarChart3, LogOut, LogIn } from "lucide-react"

export function Navigation() {
  const { data: session, status } = useSession()

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Youtube className="h-6 w-6 text-red-600" />
            <span className="font-bold text-xl">Playlist Generator</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Create
            </Link>
            <Link href="/history" className="text-sm font-medium transition-colors hover:text-primary">
              <BarChart3 className="h-4 w-4 inline mr-1" />
              Stats
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="h-8 w-8 animate-pulse bg-muted rounded-full" />
          ) : session ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:block">
                {session.user?.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => signIn("google")}
              className="gap-2"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}