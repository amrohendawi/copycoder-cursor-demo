'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ListFilter, Plus } from 'lucide-react'
import NewTaskForm from '@/components/features/tasks/NewTaskForm'

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: string
  status: 'In Progress' | 'Completed' | 'Pending'
  createdAt: Date
}

export default function TasksPage() {
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review Grant Proposal',
      description: 'Initial review of community development proposal',
      dueDate: '2024-03-25',
      priority: 'high',
      status: 'In Progress',
      createdAt: new Date()
    }
  ])

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'status' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      status: 'Pending',
      createdAt: new Date()
    }
    setTasks(prevTasks => [newTask, ...prevTasks])
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <button 
            onClick={() => setIsNewTaskModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            New Task
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <ListFilter size={20} className="text-gray-500" />
              </button>
              <input
                type="text"
                placeholder="Search tasks..."
                className="border-0 focus:ring-0 text-sm text-gray-600 placeholder-gray-400"
              />
            </div>
          </div>
          
          <div className="p-4">
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 border rounded-md hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{task.title}</h3>
                    <span className={`px-2 py-1 text-sm rounded ${
                      task.status === 'In Progress' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : task.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <NewTaskForm 
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </DashboardLayout>
  )
} 