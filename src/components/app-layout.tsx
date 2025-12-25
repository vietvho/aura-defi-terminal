'use client'

import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/sonner'
import React from 'react'
import DashboardUiSidebar from '@/features/dashboard/ui/dashboard-ui-sidebar'

export function AppLayout({
  children,
  links,
}: {
  children: React.ReactNode
  links: { label: string; path: string }[]
}) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex min-h-screen bg-[#06080f] text-white overflow-hidden">
        {/* Desktop Sidebar - Hidden on mobile, visible on md+ */}
        <DashboardUiSidebar className="hidden md:flex flex-shrink-0" />

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <div className="absolute left-0 top-0 h-full" onClick={e => e.stopPropagation()}>
              <DashboardUiSidebar onClose={() => setIsSidebarOpen(false)} />
            </div>
          </div>
        )}

        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Mobile Header with Menu Button */}
          <div className="md:hidden p-4 border-b border-white/10 flex items-center justify-between bg-[#06080f]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white/80 rounded-full blur-[1px]" />
              </div>
              <span className="font-bold">Capsule</span>
            </div>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-white/5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-0">
            {children}
          </div>
        </main>
      </div>
      <Toaster closeButton />
    </ThemeProvider>
  )
}
