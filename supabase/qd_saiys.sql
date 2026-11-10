-- Saiys бөлімі: апталық рейтинг және 8 адамға дейінгі бөлмелер.
-- Supabase → SQL Editor → New query → осыны қойып, Run басыңыз (бір рет).

create table if not exists public.qd_weekly (
  week text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  avatar text,
  tasks int not null default 0,
  xp int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (week, user_id)
);
alter table public.qd_weekly enable row level security;
drop policy if exists "weekly read" on public.qd_weekly;
drop policy if exists "weekly insert" on public.qd_weekly;
drop policy if exists "weekly update" on public.qd_weekly;
create policy "weekly read" on public.qd_weekly for select to authenticated using (true);
create policy "weekly insert" on public.qd_weekly for insert to authenticated with check (auth.uid() = user_id);
create policy "weekly update" on public.qd_weekly for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.qd_rooms (
  code text primary key,
  host uuid not null references auth.users(id) on delete cascade,
  seed int not null,
  status text not null default 'lobby',
  created_at timestamptz not null default now()
);
alter table public.qd_rooms enable row level security;
drop policy if exists "rooms read" on public.qd_rooms;
drop policy if exists "rooms insert" on public.qd_rooms;
drop policy if exists "rooms update" on public.qd_rooms;
create policy "rooms read" on public.qd_rooms for select to authenticated using (true);
create policy "rooms insert" on public.qd_rooms for insert to authenticated with check (auth.uid() = host);
create policy "rooms update" on public.qd_rooms for update to authenticated using (auth.uid() = host) with check (auth.uid() = host);

create table if not exists public.qd_room_players (
  code text not null references public.qd_rooms(code) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  avatar text,
  score int not null default 0,
  answered int not null default 0,
  done boolean not null default false,
  primary key (code, user_id)
);
alter table public.qd_room_players enable row level security;
drop policy if exists "players read" on public.qd_room_players;
drop policy if exists "players insert" on public.qd_room_players;
drop policy if exists "players update" on public.qd_room_players;
create policy "players read" on public.qd_room_players for select to authenticated using (true);
create policy "players insert" on public.qd_room_players for insert to authenticated
  with check (auth.uid() = user_id and (select count(*) from public.qd_room_players p where p.code = qd_room_players.code) < 8);
create policy "players update" on public.qd_room_players for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
