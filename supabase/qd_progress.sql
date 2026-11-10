-- TILIM · Alash: пайдаланушы прогресі (XP, тиын, мөрлер, сөз қоры...)
create table if not exists public.qd_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.qd_progress enable row level security;

create policy "qd_progress_select_own" on public.qd_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "qd_progress_insert_own" on public.qd_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "qd_progress_update_own" on public.qd_progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "qd_progress_delete_own" on public.qd_progress
  for delete to authenticated using ((select auth.uid()) = user_id);
