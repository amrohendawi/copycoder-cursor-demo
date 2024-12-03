import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
  DocumentData,
  WithFieldValue,
  DocumentReference,
  UpdateData
} from 'firebase/firestore';
import { getFirestoreInstance } from '@/lib/firebase';
import type { Contact, Document, Proposal, Task } from './types';

export const COLLECTIONS = {
  PROPOSALS: 'proposals',
  CONTACTS: 'contacts',
  DOCUMENTS: 'documents',
  TASKS: 'tasks'
} as const;

// Generic function to convert Firestore timestamp to Date
function convertTimestamps<T extends DocumentData>(data: DocumentData): T {
  const result: Record<string, unknown> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof Timestamp) {
      result[key] = value.toDate();
    } else {
      result[key] = value;
    }
  });
  
  return result as T;
}

// Generic CRUD operations
export const dbService = {
  // Create
  async create<T extends DocumentData>(
    collectionName: string,
    data: WithFieldValue<T>
  ): Promise<string> {
    const db = getFirestoreInstance();
    if (!db) throw new Error('Firestore is not initialized');

    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, data);
    return docRef.id;
  },

  // Read
  async get<T extends DocumentData>(collectionName: string, id: string): Promise<T | null> {
    const db = getFirestoreInstance();
    if (!db) throw new Error('Firestore is not initialized');

    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return convertTimestamps<T>({ id: docSnap.id, ...docSnap.data() });
  },

  // Update
  async update<T extends DocumentData>(
    collectionName: string, 
    id: string, 
    data: Partial<T>
  ): Promise<void> {
    const db = getFirestoreInstance();
    if (!db) throw new Error('Firestore is not initialized');

    const docRef = doc(db, collectionName, id);
    await updateDoc(
      docRef as DocumentReference<DocumentData, T>, 
      data as UpdateData<Partial<T>>
    );
  },

  // Delete
  async delete(collectionName: string, id: string): Promise<void> {
    const db = getFirestoreInstance();
    if (!db) throw new Error('Firestore is not initialized');

    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  },

  // Query
  async query<T extends DocumentData>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    const db = getFirestoreInstance();
    if (!db) throw new Error('Firestore is not initialized');

    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => 
      convertTimestamps<T>({ id: doc.id, ...doc.data() })
    );
  }
};

// Specific services for each collection
export const contactsService = {
  create: (data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) =>
    dbService.create<Contact>(COLLECTIONS.CONTACTS, {
      ...data,
      id: '', // Will be replaced by Firestore
      createdAt: new Date(),
      updatedAt: new Date()
    }),
  
  get: (id: string) => dbService.get<Contact>(COLLECTIONS.CONTACTS, id),
  
  update: (id: string, data: Partial<Contact>) =>
    dbService.update<Contact>(COLLECTIONS.CONTACTS, id, data),
  
  delete: (id: string) => dbService.delete(COLLECTIONS.CONTACTS, id),
  
  list: () => dbService.query<Contact>(COLLECTIONS.CONTACTS, [orderBy('createdAt', 'desc')]),
  
  findByOrganization: (organization: string) =>
    dbService.query<Contact>(COLLECTIONS.CONTACTS, [
      where('organization', '==', organization),
    ]),
};

export const documentsService = {
  create: (data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) =>
    dbService.create<Document>(COLLECTIONS.DOCUMENTS, {
      ...data,
      id: '', // Will be replaced by Firestore
      createdAt: new Date(),
      updatedAt: new Date(),
      title: data.title || '',
      type: data.type || 'other',
      url: data.url || '',
      description: data.description || '',
      createdBy: data.createdBy || '', // Ensure createdBy is provided
    }),
  
  get: (id: string) => dbService.get<Document>(COLLECTIONS.DOCUMENTS, id),
  
  update: (id: string, data: Partial<Document>) =>
    dbService.update<Document>(COLLECTIONS.DOCUMENTS, id, data),
  
  delete: (id: string) => dbService.delete(COLLECTIONS.DOCUMENTS, id),
  
  list: () => dbService.query<Document>(COLLECTIONS.DOCUMENTS, [orderBy('createdAt', 'desc')]),
  
  findByType: (type: Document['type']) =>
    dbService.query<Document>(COLLECTIONS.DOCUMENTS, [where('type', '==', type)]),
};

export const proposalsService = {
  create: async (data: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>) => {
    return dbService.create<Proposal>(COLLECTIONS.PROPOSALS, {
      ...data,
      id: '', // Will be replaced by Firestore
      createdAt: new Date(),
      updatedAt: new Date(),
      title: data.title || '',
      organization: data.organization || '',
      amount: data.amount || 0,
      description: data.description || '',
      startDate: data.startDate || new Date(),
      endDate: data.endDate || new Date(),
      status: data.status || 'draft',
      documents: data.documents || [],
      contacts: data.contacts || [],
      tasks: data.tasks || [],
      createdBy: data.createdBy || '', // Ensure createdBy is provided
    });
  },

  get: async (id: string) => {
    return dbService.get<Proposal>(COLLECTIONS.PROPOSALS, id);
  },

  update: async (id: string, data: Partial<Proposal>) => {
    return dbService.update<Proposal>(COLLECTIONS.PROPOSALS, id, data);
  },

  delete: async (id: string) => {
    return dbService.delete(COLLECTIONS.PROPOSALS, id);
  },

  list: async () => {
    return dbService.query<Proposal>(COLLECTIONS.PROPOSALS, [
      orderBy('createdAt', 'desc')
    ]);
  },

  findByStatus: async (status: Proposal['status']) => {
    return dbService.query<Proposal>(COLLECTIONS.PROPOSALS, [
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    ]);
  },

  findByOrganization: async (organization: string) => {
    return dbService.query<Proposal>(COLLECTIONS.PROPOSALS, [
      where('organization', '==', organization),
      orderBy('createdAt', 'desc')
    ]);
  },

  listByUser: async (userId: string) => {
    try {
      const db = getFirestoreInstance();
      if (!db) throw new Error('Firestore is not initialized');

      const proposalsRef = collection(db, COLLECTIONS.PROPOSALS);
      const q = query(proposalsRef, 
        where('createdBy', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '',
          organization: data.organization || '',
          amount: data.amount || 0,
          description: data.description || '',
          startDate: data.startDate?.toDate() || new Date(),
          endDate: data.endDate?.toDate() || new Date(),
          status: data.status || 'draft',
          documents: data.documents || [],
          contacts: data.contacts || [],
          tasks: data.tasks || [],
          createdBy: data.createdBy || userId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Proposal;
      });
    } catch (error) {
      console.error('Error fetching proposals:', error);
      throw error;
    }
  }
};

export const tasksService = {
  create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    return dbService.create<Task>(COLLECTIONS.TASKS, {
      ...data,
      id: '', // Will be replaced by Firestore
      createdAt: new Date(),
      updatedAt: new Date(),
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      description: data.description || '',
    });
  },

  get: (id: string) => dbService.get<Task>(COLLECTIONS.TASKS, id),

  update: (id: string, data: Partial<Task>) =>
    dbService.update<Task>(COLLECTIONS.TASKS, id, data),

  delete: (id: string) => dbService.delete(COLLECTIONS.TASKS, id),

  findByAssignee: (assignedTo: string) =>
    dbService.query<Task>(COLLECTIONS.TASKS, [
      where('createdBy', '==', assignedTo),
      orderBy('createdAt', 'desc')
    ]),

  listByUser: async (userId: string) => {
    try {
      const db = getFirestoreInstance();
      if (!db) throw new Error('Firestore is not initialized');

      const tasksRef = collection(db, COLLECTIONS.TASKS);
      const q = query(tasksRef, 
        where('createdBy', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          dueDate: data.dueDate || '',
          priority: data.priority || 'medium',
          status: data.status || 'todo',
          createdBy: data.createdBy || userId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Task;
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Method to create the required index
  async createTaskIndex(userId: string) {
    try {
      const db = getFirestoreInstance();
      if (!db) throw new Error('Firestore is not initialized');

      const tasksRef = collection(db, COLLECTIONS.TASKS);
      const indexQuery = query(
        tasksRef, 
        where('createdBy', '==', userId),
        orderBy('createdAt', 'desc')
      );

      // This will trigger the index creation
      await getDocs(indexQuery);
    } catch (error) {
      console.error('Error creating task index:', error);
      throw error;
    }
  }
};
