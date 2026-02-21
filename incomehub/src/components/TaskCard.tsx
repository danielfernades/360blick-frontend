import { View, Text, StyleSheet } from 'react-native';
import { Task } from '@/types/domain';

const statusLabel: Record<Task['status'], string> = {
  pending: 'Pendente',
  assigned: 'Atribuída',
  in_progress: 'Em andamento',
  review: 'Em revisão',
  completed: 'Concluída',
  cancelled: 'Cancelada'
};

export const TaskCard = ({ task }: { task: Task }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.meta}>{task.category.toUpperCase()} • R$ {task.amount.toFixed(2)}</Text>
      <Text numberOfLines={2} style={styles.description}>{task.description}</Text>
      <Text style={styles.status}>{statusLabel[task.status]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#121826',
    marginBottom: 12
  },
  title: { color: '#fff', fontSize: 16, fontWeight: '700' },
  meta: { color: '#99a3b3', marginTop: 4 },
  description: { color: '#c4cfdd', marginTop: 8 },
  status: { color: '#67e8f9', marginTop: 12, fontWeight: '600' }
});
