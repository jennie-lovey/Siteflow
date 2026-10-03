-- One-time upgrade for a database that already has the original schema.
-- (A fresh database gets all of this from schema.sql.)
-- Run in the Supabase SQL Editor. Safe to run once.

-- 1. Only the first account ever created may exist.
create table app_setup (
  id boolean primary key default true check (id),
  admin_created boolean not null default false
);
insert into app_setup (id, admin_created)
values (true, exists (select 1 from auth.users));
alter table app_setup enable row level security;
create policy "anyone can read setup state" on app_setup for select to anon, authenticated using (true);

create or replace function public.allow_only_first_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select admin_created from public.app_setup where id) then
    raise exception 'SiteFlow already has an admin account';
  end if;
  update public.app_setup set admin_created = true where id;
  return new;
end;
$$;

create trigger only_one_user
  before insert on auth.users
  for each row execute function public.allow_only_first_user();

-- 2. Data is only reachable by a signed-in user (i.e. the admin).
drop policy if exists "anon full access" on projects;
drop policy if exists "anon full access" on estimate_versions;
drop policy if exists "anon full access" on estimate_items;
drop policy if exists "anon full access" on expenses;
drop policy if exists "anon full access" on notes;

create policy "admin full access" on projects for all to authenticated using (true) with check (true);
create policy "admin full access" on estimate_versions for all to authenticated using (true) with check (true);
create policy "admin full access" on estimate_items for all to authenticated using (true) with check (true);
create policy "admin full access" on expenses for all to authenticated using (true) with check (true);
create policy "admin full access" on notes for all to authenticated using (true) with check (true);

-- 3. Fixes the "SECURITY DEFINER view" security warning.
alter view public.project_financials set (security_invoker = on);
