import { Task, UserProfile, WalletTransaction } from '@/types/domain';

export const mockUsers: UserProfile[] = [
  {
    id: 'u1',
    fullName: 'Marina Souza',
    rating: 4.9,
    skills: ['design', 'social media', 'edição'],
    completedTasks: 56,
    isOnline: true,
    verificationLevel: 'trusted'
  },
  {
    id: 'u2',
    fullName: 'Lucas Silva',
    rating: 4.7,
    skills: ['digitação', 'pesquisa', 'suporte'],
    completedTasks: 31,
    isOnline: false,
    verificationLevel: 'verified'
  }
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Criar 3 posts para Instagram',
    description: 'Preciso de 3 artes simples para divulgar serviços locais.',
    category: 'design',
    amount: 85,
    deadline: new Date(Date.now() + 86400000).toISOString(),
    status: 'in_progress',
    createdBy: 'u2',
    assignedTo: 'u1',
    createdAt: new Date().toISOString()
  }
];

export const mockTransactions: WalletTransaction[] = [
  {
    id: 'w1',
    userId: 'u1',
    taskId: 't0',
    type: 'credit',
    amount: 130,
    description: 'Pagamento recebido - revisão de currículo',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];
