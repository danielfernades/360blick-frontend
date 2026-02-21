import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WalletCard } from '@/components/WalletCard';
import { useApp } from '@/contexts/AppContext';

export default function WalletScreen() {
  const { balance, wallet, requestWithdraw } = useApp();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Carteira</Text>
      <WalletCard balance={balance} />
      <Pressable style={styles.button} onPress={() => requestWithdraw(50)}>
        <Text style={styles.buttonText}>Solicitar saque de R$ 50,00</Text>
      </Pressable>
      <View style={styles.list}>
        {wallet.map((tx) => (
          <View key={tx.id} style={styles.row}>
            <Text style={styles.description}>{tx.description}</Text>
            <Text style={styles.amount}>{tx.type === 'credit' ? '+' : '-'}R$ {tx.amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  content: { padding: 18, paddingBottom: 90 },
  heading: { color: '#fff', fontWeight: '800', fontSize: 26, marginBottom: 12 },
  button: {
    marginTop: 14,
    marginBottom: 10,
    backgroundColor: '#0ea5e9',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12
  },
  buttonText: { color: '#fff', fontWeight: '700' },
  list: { marginTop: 8 },
  row: {
    paddingVertical: 12,
    borderBottomColor: '#1e293b',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  description: { color: '#cbd5e1', flex: 1, paddingRight: 10 },
  amount: { color: '#fff', fontWeight: '700' }
});
