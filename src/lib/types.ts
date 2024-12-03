export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  title: string;
  type: 'proposal' | 'contract' | 'report' | 'other';
  url: string;
  description?: string;
  createdBy: string; // user ID
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    size?: number;
    format?: string;
    version?: number;
  };
}

export interface Proposal {
  id: string;
  title: string;
  organization: string;
  amount: number;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  documents: string[]; // Array of document IDs
  contacts: string[]; // Array of contact IDs
  tasks: string[]; // Array of task IDs
  createdBy: string; // user ID
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'In Progress' | 'Completed' | 'Pending';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
