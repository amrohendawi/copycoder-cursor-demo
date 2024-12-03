'use client'

import { Menu } from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'
import Breadcrumbs from './Breadcrumbs'
import { usePathname } from 'next/navigation'
import { UserButton, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'

const Header = () => {
  const { toggleMobileMenu } = useSidebar()
  const pathname = usePathname()

  // Function to generate page title from pathname
  const getPageTitle = () => {
    // If pathname is null, return a default title
    if (!pathname) return 'Dashboard'
    
    const path = pathname.split('/')
    const lastSegment = path[path.length - 1]
    return lastSegment
      ? lastSegment.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      : 'Dashboard'
  }

  // Function to determine badge content based on pathname
  const getBadgeContent = () => {
    if (!pathname) return 'Overview'
    
    if (pathname.includes('/documents')) {
      return 'Active'
    } else if (pathname.includes('/tasks')) {
      return 'In Progress'
    } else if (pathname.includes('/projects')) {
      return 'Project'
    }
    return 'Overview'
  }

  // Function to determine badge color based on content
  const getBadgeColor = () => {
    const content = getBadgeContent()
    switch (content) {
      case 'Active':
        return 'bg-green-100 text-green-700'
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700'
      case 'Project':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-purple-100 text-purple-700'
    }
  }

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
        <div className="flex-shrink-0">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
        </div>
      </div>
      
      {/* Title and Badge */}
      <div className="h-[60px] px-4 flex items-center">
        <div className="w-full flex items-center gap-2 sm:gap-3 overflow-hidden">
          <h1 className="text-xl font-semibold truncate flex-shrink">{getPageTitle()}</h1>
          <span className={`px-2 py-1 text-sm rounded flex-shrink-0 ${getBadgeColor()}`}>
            {getBadgeContent()}
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header