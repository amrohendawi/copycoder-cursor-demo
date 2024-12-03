'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Plus } from 'lucide-react'
import NewProposalForm from '@/components/features/proposals/NewProposalForm'
import ProposalDetailsModal from '@/components/features/proposals/ProposalDetailsModal'
import { proposalsService } from '@/lib/db'
import type { Proposal } from '@/lib/types'
import { useAuth } from '@clerk/nextjs';

export default function ProposalsPage() {
  const [isNewProposalModalOpen, setIsNewProposalModalOpen] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { userId } = useAuth();

  useEffect(() => {
    const loadProposals = async () => {
      try {
        if (!userId) return;
        const fetchedProposals = await proposalsService.listByUser(userId);
        setProposals(fetchedProposals);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load proposals')
      } finally {
        setIsLoading(false)
      }
    }

    loadProposals()
  }, [userId])

  const handleCreateProposal = async (proposalData: Omit<Proposal, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'documents' | 'contacts' | 'tasks' | 'createdBy'>) => {
    try {
      if (!userId) {
        throw new Error('User must be authenticated to create a proposal');
      }

      const newProposalData = {
        ...proposalData,
        status: 'draft' as const,
        documents: [],
        contacts: [],
        tasks: [],
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await proposalsService.create(newProposalData)
      
      // Refresh the proposals list
      const updatedProposals = await proposalsService.listByUser(userId);
      setProposals(updatedProposals);
      
      setIsNewProposalModalOpen(false)
    } catch (err) {
      console.error('Error creating proposal:', err)
      setError(err instanceof Error ? err.message : 'Failed to create proposal')
    }
  }

  const handleStatusChange = async (proposalId: string, newStatus: Proposal['status']) => {
    try {
      await proposalsService.update(proposalId, { status: newStatus })
      setProposals(prevProposals =>
        prevProposals.map(proposal =>
          proposal.id === proposalId
            ? { ...proposal, status: newStatus }
            : proposal
        )
      )
    } catch (err) {
      console.error('Error updating proposal status:', err)
      setError(err instanceof Error ? err.message : 'Failed to update proposal status')
    }
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

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedProposal(proposal)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{proposal.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${proposal.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        proposal.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                        proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'}`}
                    >
                      {proposal.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {proposal.description}
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Organization:</span> {proposal.organization}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${typeof proposal.amount === 'number' ? proposal.amount.toLocaleString() : '0'}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Last edited: {new Date(proposal.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <NewProposalForm
        isOpen={isNewProposalModalOpen}
        onClose={() => setIsNewProposalModalOpen(false)}
        onSubmit={handleCreateProposal}
      />

      {selectedProposal && (
        <ProposalDetailsModal
          proposal={selectedProposal}
          onClose={() => setSelectedProposal(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </DashboardLayout>
  )
}