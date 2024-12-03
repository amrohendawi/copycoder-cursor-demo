"use client"

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NewTaskModal from '@/components/features/tasks/NewTaskModal';
import { tasksService } from '@/lib/db';

export interface Task {
  id: string;
  title: string;
  description: string
  dueDate: string
  priority: string
  status: 'In Progress' | 'Completed' | 'Pending' | 'todo'
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export default function TasksPage() {
  const { user, isLoaded } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const userId = user?.id;

  useEffect(() => {
    const fetchTasks = async () => {
      if (!isLoaded || !userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const fetchedTasks = await tasksService.listByUser(userId);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [userId, isLoaded]);

  const handleCreateTask = async () => {
    try {
      if (!userId) return;

      // Refresh the tasks list
      const updatedTasks = await tasksService.listByUser(userId);
      setTasks(updatedTasks);
      
      setIsNewTaskModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
            <button 
              onClick={() => setIsNewTaskModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Create New Task
            </button>
          </div>

          {isLoading ? (
            <div>Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-gray-500">No tasks found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      task.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : task.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : task.status === 'todo'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{task.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Due: {task.dueDate}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </DashboardLayout>
  )
}