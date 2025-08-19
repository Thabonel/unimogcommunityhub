import * as React from "react"

export const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export const Tooltip = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export const TooltipTrigger = ({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) => {
  return <>{children}</>
}

export const TooltipContent = ({ children, side }: { children: React.ReactNode, side?: string }) => {
  return null // Tooltip content is hidden for now
}