import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TaskCard } from '@/components/TaskCard';
import { useApp } from '@/contexts/AppContext';

export default function TasksScreen() {
  const { tasks } = useApp();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Oportunidades ativas</Text>
      <Text style={styles.subheading}>Distribuição automática com prioridade justa e rotativa.</Text>
      <View style={{ marginTop: 16 }}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 18, paddingBottom: 90 },
  heading: { color: '#fff', fontWeight: '800', fontSize: 26 },
  subheading: { color: '#94a3b8', marginTop: 8 }
});
