'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Clock, MoreVertical, Plus } from 'lucide-react'

interface WorkflowItem {
  id: string
  title: string
  description: string
  dueDate: string
  status: 'Draft' | 'Review' | 'Approval' | 'Completed'
  assignee: string
  priority: 'low' | 'medium' | 'high'
}

export default function WorkflowPage() {
  const [items, setItems] = useState<WorkflowItem[]>([
    {
      id: '1',
      title: 'Grant Application Review',
      description: 'Review and assess new grant application for community project',
      dueDate: '2024-03-25',
      status: 'Review',
      assignee: 'Sarah Wilson',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Budget Approval',
      description: 'Final budget review for Q2 projects',
      dueDate: '2024-03-30',
      status: 'Draft',
      assignee: 'Michael Chen',
      priority: 'medium'
    }
  ])

  const columns = [
    { id: 'Draft', title: 'Draft', color: 'gray' },
    { id: 'Review', title: 'Review', color: 'yellow' },
    { id: 'Approval', title: 'Approval', color: 'blue' },
    { id: 'Completed', title: 'Completed', color: 'green' }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDragStart = (e: React.DragEvent, item: WorkflowItem) => {
    e.dataTransfer.setData('text/plain', item.id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, status: WorkflowItem['status']) => {
    e.preventDefault()
    const itemId = e.dataTransfer.getData('text/plain')
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, status }
          : item
      )
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="text-2xl font-semibold">Workflow</h1>
          <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700 justify-center">
            <Plus size={20} />
            Add Item
          </button>
        </div>

        <div className="relative -mx-6 px-6">
          <div className="overflow-x-auto pb-6">
            <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
              {columns.map((column) => (
                <div
                  key={column.id}
                  className="w-[250px] flex-shrink-0"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id as WorkflowItem['status'])}
                >
                  <div className="bg-white rounded-lg shadow">
                    <div className="p-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{column.title}</h3>
                        <span className="text-sm text-gray-500">
                          {items.filter(item => item.status === column.id).length}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 space-y-3 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto">
                      {items
                        .filter(item => item.status === column.id)
                        .map((item) => (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item)}
                            className="p-3 bg-gray-50 rounded border border-gray-200 cursor-move hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-sm truncate flex-1">{item.title}</h4>
                              <button className="p-1 hover:bg-gray-200 rounded flex-shrink-0">
                                <MoreVertical size={14} className="text-gray-500" />
                              </button>
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2 break-words">
                              {item.description}
                            </p>

                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(item.priority)}`}>
                                  {item.priority}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock size={12} />
                                <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0" />
                              <span className="text-xs text-gray-600 truncate">
                                {item.assignee}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 