'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

// Map route segments to display names
const routeMap: Record<string, string> = {
  tasks: 'Tasks',
  proposals: 'Proposals',
  workflow: 'Workflow',
  documents: 'Documents',
  contacts: 'Contacts',
}

export default function Breadcrumbs() {
  const pathname = usePathname()

  const breadcrumbs = useMemo(() => {
    // If pathname is null, return an empty array
    if (!pathname) return []

    // Remove trailing slash and split path into segments
    const segments = pathname.replace(/\/$/, '').split('/').filter(Boolean)
    
    // Generate breadcrumb items with paths
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`
      const label = routeMap[segment.toLowerCase()] || segment
      const isLast = index === segments.length - 1

      return {
        label,
        path,
        isLast
      }
    })
  }, [pathname])

  // If we're on the home page, show just "Home"
  if (pathname === '/') {
    return (
      <nav className="flex items-center text-sm min-w-max">
        <span className="text-gray-900 font-medium whitespace-nowrap">Home</span>
      </nav>
    )
  }

  // If no breadcrumbs, don't render anything
  if (breadcrumbs.length === 0) return null

  return (
    <nav className="flex items-center text-sm min-w-max">
      <Link 
        href="/"
        className="text-gray-600 whitespace-nowrap hover:text-gray-900 transition-colors"
      >
        Home
      </Link>
      {breadcrumbs.map((item) => (
        <div key={item.path} className="flex items-center">
          <ChevronRight size={16} className="mx-2 text-gray-400 flex-shrink-0" />
          {item.isLast ? (
            <span className="text-gray-900 font-medium whitespace-nowrap">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.path}
              className="text-gray-600 whitespace-nowrap hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
