'use client'

import Toolbar from '@/components/features/RichTextEditor/Toolbar'

const DocumentWorkspace = () => {
  return (
    <div className="flex-1 bg-gray-50">
      <Toolbar />
      <div className="max-w-[816px] mx-auto my-8 p-8 min-h-[1056px] bg-white shadow-sm rounded">
        <div className="prose max-w-none">
          <h1>Grant Proposal Overview</h1>
          <p className="text-gray-600">
            This document outlines the key components of our grant proposal...
          </p>
          {/* Add more content as needed */}
        </div>
      </div>
    </div>
  )
}

export default DocumentWorkspace 