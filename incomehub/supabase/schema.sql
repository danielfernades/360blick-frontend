-- IncomeHub database schema
create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  phone text,
  rating numeric(3,2) default 5.00,
  verification_level text default 'basic' check (verification_level in ('basic', 'verified', 'trusted')),
  availability boolean default true,
  created_at timestamptz default now()
);

create table if not exists user_skills (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  skill text not null,
  unique (user_id, skill)
);

create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid not null references profiles(id),
  assigned_to uuid references profiles(id),
  title text not null,
  description text not null,
  category text not null,
  amount numeric(10,2) not null,
  deadline timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'assigned', 'in_progress', 'review', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

create table if not exists task_assignment_history (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid not null references tasks(id) on delete cascade,
  executor_id uuid not null references profiles(id),
  fair_score numeric(8,4) not null,
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid not null references tasks(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  body text,
  file_url text,
  created_at timestamptz default now()
);

create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid not null references tasks(id) on delete cascade,
  reviewer_id uuid not null references profiles(id),
  reviewed_id uuid not null references profiles(id),
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

create table if not exists wallets (
  user_id uuid primary key references profiles(id) on delete cascade,
  available_balance numeric(10,2) default 0,
  pending_balance numeric(10,2) default 0,
  updated_at timestamptz default now()
);

create table if not exists wallet_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id),
  task_id uuid references tasks(id),
  tx_type text not null check (tx_type in ('credit', 'debit', 'withdrawal')),
  amount numeric(10,2) not null,
  description text not null,
  created_at timestamptz default now()
);

create table if not exists withdrawal_requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id),
  amount numeric(10,2) not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'paid')),
  requested_at timestamptz default now()
);

-- basic anti-fraud table
create table if not exists risk_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id),
  event_type text not null,
  details jsonb,
  created_at timestamptz default now()
);
