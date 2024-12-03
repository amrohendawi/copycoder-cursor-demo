'use client'

import Modal from '@/components/shared/Modal'
import { Clock, Building2, Calendar, DollarSign } from 'lucide-react'
import type { Proposal } from '@/lib/types'

interface ProposalDetailsModalProps {
  onClose: () => void
  proposal: Proposal
  onStatusChange: (proposalId: string, newStatus: Proposal['status']) => void
}

export default function ProposalDetailsModal({
  onClose,
  proposal,
  onStatusChange
}: ProposalDetailsModalProps) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    submitted: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  }

  const nextStatus = {
    draft: 'submitted',
    submitted: 'approved',
    approved: 'approved',
    rejected: 'rejected'
  } as const

  return (
    <Modal isOpen={true} onClose={onClose} title="Proposal Details">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{proposal.title}</h2>
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 text-sm rounded capitalize ${statusColors[proposal.status]}`}>
              {proposal.status}
            </span>
            {proposal.status !== 'approved' && proposal.status !== 'rejected' && (
              <button
                onClick={() => onStatusChange(proposal.id, nextStatus[proposal.status])}
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
            <p className="font-medium">${proposal.amount.toLocaleString()}</p>
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
          <p className="text-gray-600">{proposal.description}</p>
        </div>

        {/* Creation Date */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} />
          <span>Created on {new Date(proposal.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Modal>
  )
}