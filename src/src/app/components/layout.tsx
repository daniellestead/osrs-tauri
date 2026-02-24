import { Button } from "@heroui/react";
import type { ReactNode } from "react"

interface PageLayoutProps {
  children: ReactNode
  headerButton?: {
    children: React.ReactNode
    onClick: () => void
    isActive?: boolean
  }
}

export function PageLayout({ children, headerButton }: PageLayoutProps) {
  return (
    <div className="p-3">
      {headerButton && (
        <div className="flex justify-end mb-3">
          <Button
            className="text-white bg-purple-500 hover:bg-purple-700"
            onPress={headerButton.onClick}
          >
            {headerButton.children}
          </Button>
        </div>
      )}
      <div className="flex flex-col overflow-y-auto">
        {children}
      </div>
    </div>
  )
}