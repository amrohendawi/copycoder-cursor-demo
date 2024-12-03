'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Plus } from 'lucide-react'
import NewProposalForm from '@/components/features/proposals/NewProposalForm'
import ProposalDetailsModal from '@/components/features/proposals/ProposalDetailsModal'

interface Proposal {
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

export default function ProposalsPage() {
  const [isNewProposalModalOpen, setIsNewProposalModalOpen] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: '1',
      title: 'Community Development Grant',
      organization: 'Local Initiatives',
      amount: '50000',
      description: 'Supporting local initiatives for sustainable community development',
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      status: 'Draft',
      createdAt: new Date()
    }
  ])

  const handleCreateProposal = (proposalData: Omit<Proposal, 'id' | 'status' | 'createdAt'>) => {
    const newProposal: Proposal = {
      ...proposalData,
      id: Date.now().toString(),
      status: 'Draft',
      createdAt: new Date()
    }
    setProposals(prevProposals => [newProposal, ...prevProposals])
  }

  const handleStatusChange = (proposalId: string, newStatus: Proposal['status']) => {
    setProposals(prevProposals =>
      prevProposals.map(proposal =>
        proposal.id === proposalId
          ? { ...proposal, status: newStatus }
          : proposal
      )
    )
    // Update the selected proposal as well
    setSelectedProposal(prev => prev && { ...prev, status: newStatus })
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Proposals</h1>
          <button 
            onClick={() => setIsNewProposalModalOpen(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-md flex items-center gap-2 hover:bg-gray-800"
          >
            <Plus size={20} />
            New Proposal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{proposal.title}</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                  {proposal.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{proposal.description}</p>
              <p className="text-sm font-medium mt-2">
                ${Number(proposal.amount).toLocaleString()}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Last edited: {proposal.createdAt.toLocaleDateString()}
                </span>
                <button 
                  onClick={() => setSelectedProposal(proposal)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NewProposalForm 
        isOpen={isNewProposalModalOpen}
        onClose={() => setIsNewProposalModalOpen(false)}
        onSubmit={handleCreateProposal}
      />

      {selectedProposal && (
        <ProposalDetailsModal
          isOpen={!!selectedProposal}
          onClose={() => setSelectedProposal(null)}
          proposal={selectedProposal}
          onStatusChange={(newStatus) => handleStatusChange(selectedProposal.id, newStatus)}
        />
      )}
    </DashboardLayout>
  )
} 