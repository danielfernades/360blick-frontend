import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil e confiança</Text>
      <Text style={styles.item}>• Cadastro com email, Google e telefone via Supabase Auth</Text>
      <Text style={styles.item}>• Verificação de identidade e selo de confiança</Text>
      <Text style={styles.item}>• Avaliação bilateral após cada tarefa concluída</Text>
      <Text style={styles.item}>• Módulo antifraude e moderação de tarefas sensíveis</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 18 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 12 },
  item: { color: '#cbd5e1', marginBottom: 10, lineHeight: 22 }
});
