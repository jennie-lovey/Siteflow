-- Pineleaf schema
-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query) once,
-- against a fresh Supabase project.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  project_type text not null check (length(trim(project_type)) > 0),
  status text not null default 'later' check (status in ('later', 'pending', 'ongoing', 'completed')),
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  agreed_price numeric check (agreed_price is null or agreed_price >= 0),
  deleted_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_set_updated_at
  before update on projects
  for each row execute function set_updated_at();

-- Tracks when a project first became Completed, and clears it if the status
-- is later moved off Completed, so "Completed on" reflects the real event
-- rather than the last edit timestamp.
create or replace function set_completed_at()
returns trigger as $$
begin
  if new.status = 'completed' and (tg_op = 'INSERT' or old.status is distinct from 'completed') then
    new.completed_at = coalesce(new.completed_at, now());
  elsif new.status != 'completed' then
    new.completed_at = null;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger projects_set_completed_at
  before insert or update on projects
  for each row execute function set_completed_at();

-- ---------------------------------------------------------------------------
-- estimate_versions (immutable snapshots)
-- ---------------------------------------------------------------------------
create table estimate_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  version_number int not null check (version_number > 0),
  created_at timestamptz not null default now(),
  unique (project_id, version_number)
);

create index estimate_versions_project_id_idx on estimate_versions(project_id);

-- ---------------------------------------------------------------------------
-- estimate_items
-- ---------------------------------------------------------------------------
create table estimate_items (
  id uuid primary key default gen_random_uuid(),
  estimate_version_id uuid not null references estimate_versions(id) on delete cascade,
  category text not null check (length(trim(category)) > 0),
  description text not null default '',
  quantity numeric not null default 1 check (quantity >= 0),
  unit_price numeric not null default 0 check (unit_price >= 0),
  line_total numeric generated always as (quantity * unit_price) stored,
  order_index int not null default 0
);

create index estimate_items_version_id_idx on estimate_items(estimate_version_id);

-- ---------------------------------------------------------------------------
-- expenses (daily tracker)
-- ---------------------------------------------------------------------------
create table expenses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  date date not null default current_date,
  category text not null check (category in ('labour', 'materials', 'feeding', 'transportation', 'misc', 'unexpected')),
  description text not null default '',
  amount numeric not null check (amount >= 0),
  created_at timestamptz not null default now()
);

create index expenses_project_id_idx on expenses(project_id);

-- ---------------------------------------------------------------------------
-- notes (daily site log)
-- ---------------------------------------------------------------------------
create table notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  date date not null default current_date,
  work_done text not null default '',
  remaining_work text not null default '',
  delays_reason text not null default '',
  general_update text not null default '',
  created_at timestamptz not null default now()
);

create index notes_project_id_idx on notes(project_id);

-- ---------------------------------------------------------------------------
-- project_financials view: current estimate total vs. actual spent
-- ---------------------------------------------------------------------------
-- security_invoker makes the view obey the querying user's RLS instead of the
-- view creator's (Postgres views are SECURITY DEFINER by default).
create view project_financials with (security_invoker = true) as
select
  p.id as project_id,
  coalesce(v1.total, 0) as original_estimate_total,
  coalesce(cur.total, 0) as current_estimate_total,
  coalesce(exp.total, 0) as actual_spent
from projects p
left join lateral (
  select sum(ei.line_total) as total
  from estimate_versions ev
  join estimate_items ei on ei.estimate_version_id = ev.id
  where ev.project_id = p.id and ev.version_number = 1
) v1 on true
left join lateral (
  select sum(ei.line_total) as total
  from estimate_versions ev
  join estimate_items ei on ei.estimate_version_id = ev.id
  where ev.project_id = p.id
    and ev.version_number = (
      select max(version_number) from estimate_versions where project_id = p.id
    )
) cur on true
left join lateral (
  select sum(e.amount) as total
  from expenses e
  where e.project_id = p.id
) exp on true;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- No login/auth in this app (single user, accessed via the public anon key).
-- RLS is left ON with fully permissive policies so Supabase's linter stays
-- quiet and access can be tightened later without retrofitting RLS from
-- scratch onto tables that never had it.
-- ---------------------------------------------------------------------------
alter table projects enable row level security;
alter table estimate_versions enable row level security;
alter table estimate_items enable row level security;
alter table expenses enable row level security;
alter table notes enable row level security;

create policy "anon full access" on projects for all using (true) with check (true);
create policy "anon full access" on estimate_versions for all using (true) with check (true);
create policy "anon full access" on estimate_items for all using (true) with check (true);
create policy "anon full access" on expenses for all using (true) with check (true);
create policy "anon full access" on notes for all using (true) with check (true);
