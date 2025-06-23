import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ErrorMessageProps {
  title?: string
  message: string
  className?: string
}

export function ErrorMessage({ 
  title = "Error", 
  message, 
  className 
}: ErrorMessageProps) {
  return (
    <div className={cn(
      "rounded-lg border border-destructive/50 bg-destructive/10 p-4",
      className
    )}>
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <h3 className="font-medium text-destructive">{title}</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  )
}