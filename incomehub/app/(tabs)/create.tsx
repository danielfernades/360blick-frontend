import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { TaskCategory } from '@/types/domain';

export default function CreateTaskScreen() {
  const { createTask } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('support');
  const [amount, setAmount] = useState('50');

  const submit = async () => {
    if (!title || !description) return;
    await createTask({
      title,
      description,
      category,
      amount: Number(amount),
      deadline: new Date(Date.now() + 3 * 86400000).toISOString()
    });
    setTitle('');
    setDescription('');
    Alert.alert('Tarefa publicada', 'A tarefa foi distribuída automaticamente para um profissional elegível.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Nova tarefa</Text>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ex: Criar arte para anúncio" placeholderTextColor="#64748b" />
      <Text style={styles.label}>Descrição</Text>
      <TextInput style={[styles.input, styles.multiline]} multiline value={description} onChangeText={setDescription} placeholder="Descreva escopo, entregáveis e referência" placeholderTextColor="#64748b" />
      <Text style={styles.label}>Categoria</Text>
      <TextInput style={styles.input} value={category} onChangeText={(value) => setCategory((value as TaskCategory) || 'other')} placeholder="design, pesquisa, suporte..." placeholderTextColor="#64748b" />
      <Text style={styles.label}>Valor (R$)</Text>
      <TextInput keyboardType="numeric" style={styles.input} value={amount} onChangeText={setAmount} placeholderTextColor="#64748b" />
      <Pressable onPress={submit} style={styles.button}>
        <Text style={styles.buttonText}>Publicar e atribuir automaticamente</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 18, paddingBottom: 120 },
  heading: { color: '#fff', fontWeight: '800', fontSize: 26, marginBottom: 12 },
  label: { color: '#94a3b8', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#0f172a',
    color: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  multiline: { minHeight: 110, textAlignVertical: 'top' },
  button: {
    marginTop: 20,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontWeight: '700' }
});
