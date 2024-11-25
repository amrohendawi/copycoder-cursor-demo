'use client'

import Modal from '@/components/shared/Modal'
import { Calendar, FileText, Download, Clock, Eye } from 'lucide-react'
import { useState } from 'react'

interface DocumentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  document: {
    id: string
    title: string
    type: 'file' | 'folder'
    description: string
    size?: string
    createdAt: Date
    updatedAt: Date
    itemCount?: number
    fileUrl?: string
    mimeType?: string
  }
  onDownload?: () => void
}

export default function DocumentDetailsModal({
  isOpen,
  onClose,
  document,
  onDownload
}: DocumentDetailsModalProps) {
  const [showPreview, setShowPreview] = useState(false)

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase()
  }

  const canPreview = () => {
    if (!document.fileUrl) return false
    const extension = getFileExtension(document.title)
    return ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'docx'].includes(extension || '')
  }

  const renderPreview = () => {
    const extension = getFileExtension(document.title)

    if (!document.fileUrl) return null

    switch (extension) {
      case 'pdf':
        return (
          <iframe
            src={document.fileUrl}
            className="w-full h-[600px] border-0"
            title={document.title}
          />
        )
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <img
            src={document.fileUrl}
            alt={document.title}
            className="max-w-full h-auto"
          />
        )
      case 'docx':
        return (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(document.fileUrl)}`}
            className="w-full h-[600px] border-0"
            title={document.title}
          />
        )
      default:
        return (
          <div className="text-center p-4">
            <p>Preview not available for this file type</p>
            <button
              onClick={onDownload}
              className="mt-2 text-blue-600 hover:text-blue-700"
            >
              Download instead
            </button>
          </div>
        )
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Document Details">
      <div className="space-y-6">
        {showPreview ? (
          <div className="space-y-4">
            <button
              onClick={() => setShowPreview(false)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              ← Back to details
            </button>
            <div className="border rounded-lg p-2 sm:p-4 overflow-x-auto">
              {renderPreview()}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold break-words">{document.title}</h2>
              <span className="inline-block px-2 py-1 text-sm rounded bg-gray-100 text-gray-800">
                {document.type === 'folder' ? 'Folder' : 'File'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText size={16} />
                  <span>{document.type === 'folder' ? 'Items' : 'Size'}</span>
                </div>
                <p className="font-medium">
                  {document.type === 'folder' ? `${document.itemCount} items` : document.size}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>Last Modified</span>
                </div>
                <p className="font-medium">{document.updatedAt.toLocaleDateString()}</p>
              </div>
            </div>

            {document.description && (
              <div className="space-y-2">
                <h3 className="font-medium">Description</h3>
                <p className="text-gray-600 text-sm">{document.description}</p>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-medium">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-gray-600">
                    Created on {document.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
              {document.type === 'file' && (
                <>
                  {canPreview() && (
                    <button
                      onClick={() => setShowPreview(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md w-full sm:w-auto"
                    >
                      <Eye size={16} />
                      Preview
                    </button>
                  )}
                  <button
                    onClick={onDownload}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md w-full sm:w-auto"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
} 