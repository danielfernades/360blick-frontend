# IncomeHub — App de renda por tarefas simples (Web + Mobile)

MVP moderno com Expo (React Native + Web) e Supabase, focado em conectar clientes e executores para tarefas rápidas com **distribuição automática justa**.

## Stack
- **Frontend:** Expo + React Native + Expo Router (iOS, Android e Web)
- **Backend:** Supabase (Auth, Postgres, Realtime, Storage, Edge Functions)
- **Algoritmo de distribuição:** Edge Function `auto-assign`

## Funcionalidades implementadas no MVP
- Cadastro/Login preparado para Supabase Auth (email, Google, telefone)
- Tela de tarefas e criação de novas tarefas
- Atribuição automática simulada no app e função server-side para produção
- Carteira interna com saldo, transações e solicitação de saque
- Estrutura para chat e envio de arquivos (tabelas `messages` + `file_url`)
- Estrutura de avaliação bilateral (`reviews`)
- Estrutura anti-fraude e moderação (`risk_events`, níveis de verificação)

## Como rodar
```bash
cd incomehub
npm install
npm run web
```

## Variáveis de ambiente
Crie um `.env` na pasta `incomehub`:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
```

## Banco de dados
Aplique o schema:
```bash
supabase db reset
# ou execute incomehub/supabase/schema.sql no SQL Editor
```

## Edge Function de distribuição justa
Deploy:
```bash
supabase functions deploy auto-assign
```

Entrada esperada:
```json
{
  "taskId": "uuid-da-tarefa",
  "category": "design"
}
```

Critérios do score:
- Match de habilidade
- Rating do executor
- Disponibilidade
- Penalidade para quem recebeu tarefas recentemente (rotatividade)
- Pequena aleatoriedade controlada para desempate e fairness

## Próximos passos para produção
1. Ativar Supabase Realtime para `tasks`, `messages` e `wallet_transactions`
2. Adicionar push notifications (Expo Notifications)
3. Implementar KYC (verificação documental)
4. Regras robustas antifraude com bloqueio automático por comportamento suspeito
5. Termos de uso e política de privacidade dentro do app
