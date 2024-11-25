'use client'

import Modal from '@/components/shared/Modal'
import { Mail, Phone, Building2, FileText, Clock, Upload, User } from 'lucide-react'
import Image from 'next/image'

interface ContactDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  contact: {
    id: string
    name: string
    role: string
    email: string
    phone: string
    organization: string
    notes: string
    avatar: string
    createdAt: Date
  }
  onAvatarChange: (contactId: string, file: File) => void
}

export default function ContactDetailsModal({
  isOpen,
  onClose,
  contact,
  onAvatarChange
}: ContactDetailsModalProps) {
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onAvatarChange(contact.id, file)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Details">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="relative group">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
              {contact.avatar ? (
                <Image
                  src={contact.avatar}
                  alt={contact.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={32} className="text-gray-400" />
                </div>
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
              <Upload size={16} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{contact.name}</h2>
            <p className="text-gray-600">{contact.role}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Building2 size={20} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Organization</p>
              <p className="font-medium">{contact.organization}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail size={20} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <a href={`mailto:${contact.email}`} className="font-medium text-blue-600 hover:text-blue-700">
                {contact.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone size={20} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <a href={`tel:${contact.phone}`} className="font-medium text-blue-600 hover:text-blue-700">
                {contact.phone}
              </a>
            </div>
          </div>
        </div>

        {contact.notes && (
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <FileText size={16} className="text-gray-400" />
              Notes
            </h3>
            <p className="text-gray-600 text-sm">{contact.notes}</p>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} />
            <span>Added on {contact.createdAt.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
} 