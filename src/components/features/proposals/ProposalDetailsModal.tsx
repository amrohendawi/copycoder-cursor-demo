'use client'

import Modal from '@/components/shared/Modal'
import { Clock, Building2, Calendar, DollarSign } from 'lucide-react'

interface ProposalDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  proposal: {
    id: string
    title: string
    organization: string
    amount: string
    description: string
    startDate: string
    endDate: string
    status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved'
    createdAt: Date
  }
  onStatusChange: (newStatus: 'Draft' | 'Submitted' | 'Under Review' | 'Approved') => void
}

export default function ProposalDetailsModal({
  isOpen,
  onClose,
  proposal,
  onStatusChange
}: ProposalDetailsModalProps) {
  const statusColors = {
    Draft: 'bg-gray-100 text-gray-800',
    Submitted: 'bg-blue-100 text-blue-800',
    'Under Review': 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800'
  }

  const nextStatus = {
    Draft: 'Submitted',
    Submitted: 'Under Review',
    'Under Review': 'Approved',
    Approved: 'Approved'
  } as const

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Proposal Details">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{proposal.title}</h2>
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 text-sm rounded ${statusColors[proposal.status]}`}>
              {proposal.status}
            </span>
            {proposal.status !== 'Approved' && (
              <button
                onClick={() => onStatusChange(nextStatus[proposal.status])}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Move to {nextStatus[proposal.status]}
              </button>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 size={16} />
              <span>Organization</span>
            </div>
            <p className="font-medium">{proposal.organization}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign size={16} />
              <span>Amount</span>
            </div>
            <p className="font-medium">${Number(proposal.amount).toLocaleString()}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>Start Date</span>
            </div>
            <p className="font-medium">{new Date(proposal.startDate).toLocaleDateString()}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>End Date</span>
            </div>
            <p className="font-medium">{new Date(proposal.endDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="font-medium">Description</h3>
          <p className="text-gray-600 text-sm">{proposal.description}</p>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <h3 className="font-medium">Timeline</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className="text-gray-400" />
              <span className="text-gray-600">Created on {proposal.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
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