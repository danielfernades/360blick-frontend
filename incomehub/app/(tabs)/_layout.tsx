import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#60a5fa',
        tabBarStyle: { backgroundColor: '#020617', borderTopColor: '#1e293b' }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Tarefas', tabBarIcon: ({ color }) => <FontAwesome5 name="tasks" size={18} color={color} /> }}
      />
      <Tabs.Screen
        name="create"
        options={{ title: 'Criar', tabBarIcon: ({ color }) => <FontAwesome5 name="plus-circle" size={18} color={color} /> }}
      />
      <Tabs.Screen
        name="wallet"
        options={{ title: 'Carteira', tabBarIcon: ({ color }) => <FontAwesome5 name="wallet" size={18} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Perfil', tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={18} color={color} /> }}
      />
    </Tabs>
  );
}
