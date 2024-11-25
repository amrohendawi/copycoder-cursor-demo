'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { FileText, Folder, MoreVertical, Plus, Search, Upload } from 'lucide-react'
import NewDocumentForm from '@/components/features/documents/NewDocumentForm'
import DocumentDetailsModal from '@/components/features/documents/DocumentDetailsModal'

interface Document {
  id: string
  title: string
  type: 'file' | 'folder'
  description: string
  size?: string
  itemCount?: number
  createdAt: Date
  updatedAt: Date
  fileUrl?: string
  file?: File
  mimeType?: string
}

export default function DocumentsPage() {
  const [isNewDocumentModalOpen, setIsNewDocumentModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [documents, setDocuments] = useState<Document[]>([
    { 
      id: '1',
      type: 'folder',
      title: 'Grant Proposals',
      description: 'All grant proposal documents',
      itemCount: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileUrl = URL.createObjectURL(file)
      handleCreateDocument({
        title: file.name,
        type: 'file',
        description: '',
        file,
        fileUrl,
        mimeType: file.type
      })
    }
  }

  const handleCreateDocument = (documentData: {
    title: string
    type: 'file' | 'folder'
    description: string
    file?: File
    fileUrl?: string
    mimeType?: string
  }) => {
    const newDocument: Document = {
      ...documentData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      size: documentData.file?.size 
        ? `${(documentData.file.size / (1024 * 1024)).toFixed(1)} MB`
        : undefined,
      itemCount: documentData.type === 'folder' ? 0 : undefined,
      fileUrl: documentData.fileUrl,
      file: documentData.file,
      mimeType: documentData.mimeType
    }
    setDocuments(prevDocuments => [newDocument, ...prevDocuments])
  }

  const handleDownload = (document: Document) => {
    if (document.fileUrl) {
      const link = window.document.createElement('a')
      link.href = document.fileUrl
      link.download = document.title
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <h1 className="text-2xl font-semibold">Documents</h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <label className="px-4 py-2 text-gray-700 border rounded-md flex items-center gap-2 hover:bg-gray-50 cursor-pointer w-full sm:w-auto justify-center">
              <Upload size={20} />
              <span>Upload</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </label>
            <button 
              onClick={() => setIsNewDocumentModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700 w-full sm:w-auto justify-center"
            >
              <Plus size={20} />
              <span>New Document</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="block sm:hidden">
            <div className="divide-y">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    {doc.type === 'folder' ? (
                      <Folder size={20} className="text-gray-400 flex-shrink-0" />
                    ) : (
                      <FileText size={20} className="text-gray-400 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <button 
                        onClick={() => setSelectedDocument(doc)}
                        className="font-medium hover:text-blue-600 text-left block w-full truncate"
                      >
                        {doc.title}
                      </button>
                      <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
                        <span>{doc.updatedAt.toLocaleDateString()}</span>
                        <span>{doc.type === 'folder' ? `${doc.itemCount} items` : doc.size}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden sm:block">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="pb-3 px-4 font-medium">Name</th>
                  <th className="pb-3 font-medium">Last Modified</th>
                  <th className="pb-3 font-medium">Size</th>
                  <th className="pb-3 font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 flex items-center gap-3">
                      {doc.type === 'folder' ? (
                        <Folder size={20} className="text-gray-400" />
                      ) : (
                        <FileText size={20} className="text-gray-400" />
                      )}
                      <button 
                        onClick={() => setSelectedDocument(doc)}
                        className="font-medium hover:text-blue-600"
                      >
                        {doc.title}
                      </button>
                    </td>
                    <td className="py-3 text-sm text-gray-500">
                      {doc.updatedAt.toLocaleDateString()}
                    </td>
                    <td className="py-3 text-sm text-gray-500">
                      {doc.type === 'folder' ? `${doc.itemCount} items` : doc.size}
                    </td>
                    <td className="py-3">
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <MoreVertical size={16} className="text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <NewDocumentForm 
        isOpen={isNewDocumentModalOpen}
        onClose={() => setIsNewDocumentModalOpen(false)}
        onSubmit={handleCreateDocument}
      />

      {selectedDocument && (
        <DocumentDetailsModal
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
          document={{
            ...selectedDocument,
            fileUrl: selectedDocument.fileUrl || undefined
          }}
          onDownload={() => handleDownload(selectedDocument)}
        />
      )}
    </DashboardLayout>
  )
} 