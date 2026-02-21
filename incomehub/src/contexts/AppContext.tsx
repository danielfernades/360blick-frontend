import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';
import { mockTasks, mockTransactions, mockUsers } from '@/data/mockData';
import { Task, TaskCategory, WalletTransaction } from '@/types/domain';

const currentUserId = 'u1';

type CreateTaskPayload = {
  title: string;
  description: string;
  category: TaskCategory;
  amount: number;
  deadline: string;
};

type AppContextType = {
  tasks: Task[];
  wallet: WalletTransaction[];
  balance: number;
  createTask: (payload: CreateTaskPayload) => Promise<void>;
  requestWithdraw: (amount: number) => void;
  userId: string;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [wallet, setWallet] = useState<WalletTransaction[]>(mockTransactions);

  const createTask = async (payload: CreateTaskPayload) => {
    const candidate = mockUsers[0];
    const createdTask: Task = {
      id: `t${Date.now()}`,
      title: payload.title,
      description: payload.description,
      category: payload.category,
      amount: payload.amount,
      deadline: payload.deadline,
      status: 'assigned',
      createdBy: currentUserId,
      assignedTo: candidate.id,
      createdAt: new Date().toISOString()
    };

    setTasks((prev) => [createdTask, ...prev]);
  };

  const requestWithdraw = (amount: number) => {
    const withdrawal: WalletTransaction = {
      id: `wd-${Date.now()}`,
      userId: currentUserId,
      type: 'withdraw',
      amount,
      description: 'Solicitação de saque pendente',
      createdAt: new Date().toISOString()
    };

    setWallet((prev) => [withdrawal, ...prev]);
  };

  const balance = useMemo(() => {
    return wallet.reduce((sum, tx) => {
      if (tx.type === 'credit') return sum + tx.amount;
      return sum - tx.amount;
    }, 0);
  }, [wallet]);

  return (
    <AppContext.Provider value={{ tasks, wallet, balance, createTask, requestWithdraw, userId: currentUserId }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
