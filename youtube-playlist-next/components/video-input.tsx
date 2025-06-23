"use client"

import { useState, useCallback } from "react"
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VideoInputProps {
  urls: string[]
  onUrlsChange: (urls: string[]) => void
  validating?: boolean
  validationResults?: any
}

export function VideoInput({ 
  urls, 
  onUrlsChange, 
  validating,
  validationResults 
}: VideoInputProps) {
  const [bulkInput, setBulkInput] = useState("")

  const removeUrl = useCallback((index: number) => {
    onUrlsChange(urls.filter((_, i) => i \!== index))
  }, [urls, onUrlsChange])

  const handleBulkAdd = () => {
    const newUrls = bulkInput
      .split(/[\n,]/) // Split by newline or comma
      .map(url => url.trim())
      .filter(url => url.length > 0)
    
    // Replace all URLs instead of appending
    if (newUrls.length > 0) {
      onUrlsChange(newUrls)
      setBulkInput("")
    }
  }

  const getVideoValidation = (url: string) => {
    if (\!validationResults?.videos) return null
    return validationResults.videos.find((v: any) => 
      url.includes(v.videoId)
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          YouTube Videos ({urls.length})
        </label>
      </div>

      <div className="space-y-2">
        <textarea
          className="w-full min-h-[150px] p-3 rounded-md border border-input bg-background"
          placeholder="Paste YouTube URLs (one per line or comma-separated)"
          value={bulkInput}
          onChange={(e) => setBulkInput(e.target.value)}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setBulkInput("")
              onUrlsChange([])
            }}
            disabled={urls.length === 0 && \!bulkInput.trim()}
          >
            Clear All
          </Button>
          <Button
            type="button"
            onClick={handleBulkAdd}
            disabled={\!bulkInput.trim()}
          >
            Add Videos
          </Button>
        </div>
      </div>

      {urls.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {urls.map((url, index) => {
            const validation = getVideoValidation(url)
            return (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-md border bg-background/50",
                  validation?.valid === false && "border-destructive/50 bg-destructive/5"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{url}</div>
                  {validation && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {validation.valid ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {validation.title}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          {validation.error}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {validating && \!validation && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUrl(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {validationResults && (
        <div className="text-sm text-muted-foreground">
          {validationResults.valid} valid, {validationResults.invalid} invalid
        </div>
      )}
    </div>
  )
}
EOF < /dev/null