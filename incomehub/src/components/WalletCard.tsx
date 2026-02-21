import { View, Text, StyleSheet } from 'react-native';

export const WalletCard = ({ balance }: { balance: number }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Saldo disponível</Text>
      <Text style={styles.amount}>R$ {balance.toFixed(2)}</Text>
      <Text style={styles.tip}>Saque em até 24h para contas verificadas.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 18,
    backgroundColor: '#1d4ed8'
  },
  label: { color: '#dbeafe', fontSize: 13 },
  amount: { color: '#fff', fontSize: 30, fontWeight: '800', marginTop: 6 },
  tip: { color: '#dbeafe', marginTop: 8 }
});
