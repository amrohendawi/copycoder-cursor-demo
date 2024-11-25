'use client'

import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, ChevronDown 
} from 'lucide-react'

const Toolbar = () => {
  return (
    <div className="h-[48px] border-b border-gray-200 px-4 flex items-center gap-2">
      <div className="flex items-center border-r border-gray-200 pr-2">
        <button className="p-2 hover:bg-gray-100 rounded">
          <Bold size={18} className="text-gray-700" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <Italic size={18} className="text-gray-700" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <Underline size={18} className="text-gray-700" />
        </button>
      </div>
      
      <div className="flex items-center border-r border-gray-200 pr-2">
        <button className="p-2 hover:bg-gray-100 rounded">
          <AlignLeft size={18} className="text-gray-700" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <AlignCenter size={18} className="text-gray-700" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <AlignRight size={18} className="text-gray-700" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <AlignJustify size={18} className="text-gray-700" />
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center border rounded px-2 py-1">
          <span className="text-sm text-gray-700">Arial</span>
          <ChevronDown size={16} className="ml-2 text-gray-500" />
        </div>
        <div className="flex items-center border rounded px-2 py-1">
          <span className="text-sm text-gray-700">12</span>
          <ChevronDown size={16} className="ml-2 text-gray-500" />
        </div>
      </div>
    </div>
  )
}

export default Toolbar 