import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function useKeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      // Cmd/Ctrl + K: Focus on first input
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        const firstInput = document.querySelector("input")
        firstInput?.focus()
      }

      // Cmd/Ctrl + H: Go to history
      if ((e.metaKey || e.ctrlKey) && e.key === "h") {
        e.preventDefault()
        router.push("/history")
      }

      // Cmd/Ctrl + N: Go to home (new playlist)
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault()
        router.push("/")
      }

      // Escape: Clear focus
      if (e.key === "Escape") {
        const activeElement = document.activeElement as HTMLElement
        activeElement?.blur()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [router])
}