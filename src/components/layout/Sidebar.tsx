'use client'

import { Home, FileText, Workflow, FolderOpen, Contact } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/context/SidebarContext'

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false)
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar()
  const pathname = usePathname()

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: FileText, label: 'Tasks', href: '/tasks' },
    { icon: FolderOpen, label: 'Proposals', href: '/proposals' },
    { icon: Workflow, label: 'Workflow', href: '/workflow' },
    { icon: FileText, label: 'Documents', href: '/documents' },
    { icon: Contact, label: 'Contacts', href: '/contacts' },
  ]

  return (
    <>
      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        sm:translate-x-0 sm:w-[250px]
        w-[280px]
        shadow-xl sm:shadow-none
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 mb-6 mt-4">
            <Image 
              src="https://picsum.photos/200/60" 
              alt="Logo" 
              width={200} 
              height={60}
              className="rounded"
              priority
            />
          </div>
          <nav className="flex-1 px-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 text-gray-700 rounded-md mb-1
                    transition-colors duration-150
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'hover:bg-gray-100'
                    }
                  `}
                  onClick={() => isMobile && setIsMobileMenuOpen(false)}
                >
                  <item.icon size={20} className={isActive ? 'text-blue-600' : ''} />
                  <span className={isActive ? 'font-medium' : ''}>{item.label}</span>
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Version 1.0.0
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar