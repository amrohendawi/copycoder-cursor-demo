'use client'

import { ChevronRight } from 'lucide-react'

const Header = () => {
  return (
    <header className="h-auto sm:h-[108px] border-b border-gray-200 bg-white">
      {/* Breadcrumbs */}
      <div className="h-[48px] px-4 flex items-center border-b border-gray-200">
        <div className="w-full overflow-x-auto scrollbar-hide">
          <nav className="flex items-center text-sm min-w-max">
            <span className="text-gray-600 whitespace-nowrap">Document Templates</span>
            <ChevronRight size={16} className="mx-2 text-gray-400 flex-shrink-0" />
            <span className="text-gray-600 whitespace-nowrap">Board Books</span>
            <ChevronRight size={16} className="mx-2 text-gray-400 flex-shrink-0" />
            <span className="text-gray-900 font-medium whitespace-nowrap">Q2</span>
          </nav>
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