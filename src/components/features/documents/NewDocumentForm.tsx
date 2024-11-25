'use client'

import { useState } from 'react'
import Modal from '@/components/shared/Modal'
import { Upload } from 'lucide-react'

interface NewDocumentFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    title: string
    type: 'file' | 'folder'
    description: string
    file?: File
    fileUrl?: string
    mimeType?: string
  }) => void
}

export default function NewDocumentForm({ isOpen, onClose, onSubmit }: NewDocumentFormProps) {
  const [formData, setFormData] = useState<{
    title: string
    type: 'file' | 'folder'
    description: string
  }>({
    title: '',
    type: 'file',
    description: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileUrl(URL.createObjectURL(selectedFile))
      setFormData(prev => ({ ...prev, title: selectedFile.name }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      file: file || undefined,
      fileUrl: fileUrl || undefined,
      mimeType: file?.type
    })
    setFormData({ title: '', type: 'file', description: '' })
    setFile(null)
    setFileUrl(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Document">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'file' | 'folder' })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="file">File</option>
            <option value="folder">Folder</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {formData.type === 'file' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">File</label>
            <div className="mt-1 flex items-center justify-center w-full px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  {file ? file.name : 'PDF, DOC, DOCX, JPG up to 10MB'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </form>
    </Modal>
  )
} 