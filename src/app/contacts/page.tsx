'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Plus, Search } from 'lucide-react'
import NewContactForm from '@/components/features/contacts/NewContactForm'
import ContactDetailsModal from '@/components/features/contacts/ContactDetailsModal'
import Image from 'next/image'

interface Contact {
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

export default function ContactsPage() {
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Sarah Wilson',
      role: 'Grant Manager',
      email: 'sarah.wilson@example.com',
      phone: '+1 (555) 123-4567',
      organization: 'Community Foundation',
      notes: 'Primary contact for education grants',
      avatar: 'https://picsum.photos/seed/1/200/200',
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Program Director',
      email: 'michael.chen@example.com',
      phone: '+1 (555) 234-5678',
      organization: 'Youth Development Initiative',
      notes: 'Manages youth program partnerships',
      avatar: 'https://picsum.photos/seed/2/200/200',
      createdAt: new Date()
    }
  ])

  const handleCreateContact = (contactData: Omit<Contact, 'id' | 'avatar' | 'createdAt'> & { avatar?: File }) => {
    const avatarUrl = contactData.avatar 
      ? URL.createObjectURL(contactData.avatar)
      : `https://picsum.photos/seed/${Date.now()}/200/200`

    const newContact: Contact = {
      ...contactData,
      id: Date.now().toString(),
      avatar: avatarUrl,
      createdAt: new Date()
    }
    setContacts(prevContacts => [newContact, ...prevContacts])
  }

  const handleAvatarChange = (contactId: string, file: File) => {
    const avatarUrl = URL.createObjectURL(file)
    setContacts(prevContacts =>
      prevContacts.map(contact =>
        contact.id === contactId
          ? { ...contact, avatar: avatarUrl }
          : contact
      )
    )
    // Update the selected contact as well
    setSelectedContact(prev =>
      prev?.id === contactId
        ? { ...prev, avatar: avatarUrl }
        : prev
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Contacts</h1>
          <button 
            onClick={() => setIsNewContactModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Contact
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {contacts.map((contact) => (
              <div 
                key={contact.id} 
                className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={contact.avatar}
                    alt={contact.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{contact.name}</h3>
                    <p className="text-sm text-gray-500">{contact.role}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{contact.organization}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-blue-600 hover:text-blue-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NewContactForm 
        isOpen={isNewContactModalOpen}
        onClose={() => setIsNewContactModalOpen(false)}
        onSubmit={handleCreateContact}
      />

      {selectedContact && (
        <ContactDetailsModal
          isOpen={!!selectedContact}
          onClose={() => setSelectedContact(null)}
          contact={selectedContact}
          onAvatarChange={handleAvatarChange}
        />
      )}
    </DashboardLayout>
  )
} 