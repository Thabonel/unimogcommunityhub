import * as React from "react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange?.(false)}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  )
}

export const DialogContent = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) => {
  return (
    <div className={cn(
      "relative z-50 bg-white rounded-lg shadow-lg max-w-lg w-full",
      className
    )}>
      {children}
    </div>
  )
}

export const DialogHeader = ({ 
  children,
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) => {
  return (
    <div className={cn("px-6 py-4 border-b", className)}>
      {children}
    </div>
  )
}