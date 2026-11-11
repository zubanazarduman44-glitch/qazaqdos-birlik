-- TILIM: «Менің сыныбым» (мұғалім / оқушы) кестелері. Supabase → SQL Editor ішіне бүтін көшіріп, Run басыңыз.
create table if not exists public.qd_classes (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  code text not null unique,
  created_at timestamptz default now()
);
create table if not exists public.qd_members (
  class_id uuid not null references public.qd_classes(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text, avatar text,
  xp int default 0, week_xp int default 0, streak int default 0, lessons int default 0, words int default 0,
  last_active timestamptz default now(),
  joined_at timestamptz default now(),
  primary key (class_id, user_id)
);
create table if not exists public.qd_tasks (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.qd_classes(id) on delete cascade,
  title text not null,
  kind text not null,
  ref text,
  due date,
  created_at timestamptz default now()
);
create table if not exists public.qd_subs (
  task_id uuid not null references public.qd_tasks(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  done boolean default false,
  score int default 0,
  base int default 0,
  updated_at timestamptz default now(),
  primary key (task_id, user_id)
);

alter table public.qd_classes enable row level security;
alter table public.qd_members enable row level security;
alter table public.qd_tasks enable row level security;
alter table public.qd_subs enable row level security;

create or replace function public.qd_is_owner(cid uuid) returns boolean
  language sql security definer stable set search_path = public as
$$ select exists (select 1 from public.qd_classes where id = cid and owner = auth.uid()) $$;
create or replace function public.qd_is_member(cid uuid) returns boolean
  language sql security definer stable set search_path = public as
$$ select exists (select 1 from public.qd_members where class_id = cid and user_id = auth.uid()) $$;
create or replace function public.qd_task_owner(tid uuid) returns boolean
  language sql security definer stable set search_path = public as
$$ select exists (select 1 from public.qd_tasks t join public.qd_classes c on c.id = t.class_id where t.id = tid and c.owner = auth.uid()) $$;
create or replace function public.qd_task_member(tid uuid) returns boolean
  language sql security definer stable set search_path = public as
$$ select exists (select 1 from public.qd_tasks t join public.qd_members m on m.class_id = t.class_id where t.id = tid and m.user_id = auth.uid()) $$;

drop policy if exists classes_sel on public.qd_classes;
drop policy if exists classes_ins on public.qd_classes;
drop policy if exists classes_upd on public.qd_classes;
drop policy if exists classes_del on public.qd_classes;
create policy classes_sel on public.qd_classes for select using (owner = auth.uid() or public.qd_is_member(id));
create policy classes_ins on public.qd_classes for insert with check (owner = auth.uid());
create policy classes_upd on public.qd_classes for update using (owner = auth.uid());
create policy classes_del on public.qd_classes for delete using (owner = auth.uid());

drop policy if exists members_sel on public.qd_members;
drop policy if exists members_upd on public.qd_members;
drop policy if exists members_del on public.qd_members;
create policy members_sel on public.qd_members for select using (user_id = auth.uid() or public.qd_is_owner(class_id));
create policy members_upd on public.qd_members for update using (user_id = auth.uid());
create policy members_del on public.qd_members for delete using (user_id = auth.uid() or public.qd_is_owner(class_id));

drop policy if exists tasks_sel on public.qd_tasks;
drop policy if exists tasks_ins on public.qd_tasks;
drop policy if exists tasks_upd on public.qd_tasks;
drop policy if exists tasks_del on public.qd_tasks;
create policy tasks_sel on public.qd_tasks for select using (public.qd_is_owner(class_id) or public.qd_is_member(class_id));
create policy tasks_ins on public.qd_tasks for insert with check (public.qd_is_owner(class_id));
create policy tasks_upd on public.qd_tasks for update using (public.qd_is_owner(class_id));
create policy tasks_del on public.qd_tasks for delete using (public.qd_is_owner(class_id));

drop policy if exists subs_sel on public.qd_subs;
drop policy if exists subs_ins on public.qd_subs;
drop policy if exists subs_upd on public.qd_subs;
create policy subs_sel on public.qd_subs for select using (user_id = auth.uid() or public.qd_task_owner(task_id));
create policy subs_ins on public.qd_subs for insert with check (user_id = auth.uid() and public.qd_task_member(task_id));
create policy subs_upd on public.qd_subs for update using (user_id = auth.uid());

create or replace function public.join_class(p_code text, p_name text, p_avatar text) returns public.qd_classes
  language plpgsql security definer set search_path = public as
$$
declare c public.qd_classes;
begin
  select * into c from public.qd_classes where code = upper(trim(p_code));
  if not found then raise exception 'class_not_found'; end if;
  insert into public.qd_members (class_id, user_id, name, avatar)
    values (c.id, auth.uid(), p_name, p_avatar)
    on conflict (class_id, user_id) do update set name = excluded.name, avatar = excluded.avatar;
  return c;
end
$$;
grant execute on function public.join_class(text, text, text) to authenticated;
grant select, insert, update, delete on public.qd_classes, public.qd_members, public.qd_tasks, public.qd_subs to authenticated;
