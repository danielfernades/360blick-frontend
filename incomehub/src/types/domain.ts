export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'review' | 'completed' | 'cancelled';

export type UserProfile = {
  id: string;
  fullName: string;
  avatarUrl?: string;
  rating: number;
  skills: string[];
  completedTasks: number;
  isOnline: boolean;
  verificationLevel: 'basic' | 'verified' | 'trusted';
};

export type TaskCategory = 'design' | 'typing' | 'support' | 'research' | 'local' | 'other';

export type Task = {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  amount: number;
  deadline: string;
  status: TaskStatus;
  createdBy: string;
  assignedTo?: string;
  createdAt: string;
};

export type WalletTransaction = {
  id: string;
  userId: string;
  taskId?: string;
  type: 'credit' | 'debit' | 'withdraw';
  amount: number;
  description: string;
  createdAt: string;
};
