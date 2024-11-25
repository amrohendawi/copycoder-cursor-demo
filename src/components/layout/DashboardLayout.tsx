'use client'

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 sm:ml-[250px] flex flex-col min-h-screen max-w-full">
        <Header />
        <div className="flex-1 p-4 sm:p-6 pt-20 sm:pt-6 overflow-x-hidden">
          <div className="max-w-[1920px] mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout 