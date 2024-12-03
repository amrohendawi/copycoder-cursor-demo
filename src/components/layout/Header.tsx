'use client'

import { Menu } from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'
import Breadcrumbs from './Breadcrumbs'

const Header = () => {
  const { toggleMobileMenu } = useSidebar()

  return (
    <header className="h-auto sm:h-[108px] border-b border-gray-200 bg-white">
      {/* Breadcrumbs */}
      <div className="h-[48px] px-4 flex items-center gap-3 border-b border-gray-200">
        <button 
          className="sm:hidden p-2 hover:bg-gray-100 rounded-lg" 
          aria-label="Toggle menu"
          onClick={toggleMobileMenu}
        >
          <Menu size={24} className="text-gray-700" />
        </button>
        <div className="w-full overflow-x-auto scrollbar-hide">
          <Breadcrumbs />
        </div>
      </div>
      
      {/* Title and Badge */}
      <div className="h-[60px] px-4 flex items-center">
        <div className="max-w-full flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <h1 className="text-xl font-semibold truncate">Board Document</h1>
          <span className="px-2 py-1 text-sm bg-purple-100 text-purple-700 rounded w-fit">
            Board Document
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header