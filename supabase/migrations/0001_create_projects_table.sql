-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── Enums ───────────────────────────────────────────────────────────────────

create type project_type as enum (
  'website',
  'web_app',
  'mobile_app',
  'saas_platform',
  'software'
);

create type project_status as enum (
  'draft',
  'generating',
  'ready',
  'failed'
);

create type plan_type as enum (
  'free',
  'pro',
  'enterprise'
);

-- ─── projects ────────────────────────────────────────────────────────────────

create table if not exists projects (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  name             text not null,
  prompt           text not null,
  project_type     project_type not null,
  status           project_status not null default 'draft',
  architecture     jsonb,
  error_message    text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- auto-update updated_at
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_updated_at
  before update on projects
  for each row execute procedure update_updated_at_column();

-- indexes
create index if not exists projects_user_id_idx on projects(user_id);
create index if not exists projects_status_idx  on projects(status);

-- RLS
alter table projects enable row level security;

create policy "Users can view their own projects"
  on projects for select
  using (auth.uid() = user_id);

create policy "Users can insert their own projects"
  on projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on projects for delete
  using (auth.uid() = user_id);

-- ─── usage_counters ──────────────────────────────────────────────────────────

create table if not exists usage_counters (
  user_id                 uuid primary key references auth.users(id) on delete cascade,
  plan                    plan_type not null default 'free',
  generations_this_month  integer not null default 0,
  period_start            timestamptz not null default date_trunc('month', now())
);

-- RLS
alter table usage_counters enable row level security;

create policy "Users can view their own usage"
  on usage_counters for select
  using (auth.uid() = user_id);

create policy "Users can insert their own usage"
  on usage_counters for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own usage"
  on usage_counters for update
  using (auth.uid() = user_id);
