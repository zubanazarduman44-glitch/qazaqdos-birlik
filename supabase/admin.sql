-- TILIM: әкімші панелі. Supabase → SQL Editor-де іске қосыңыз.
-- МАҢЫЗДЫ: төмендегі YOUR_EMAIL орнына өз email-іңізді жазыңыз (сайтқа кіретін аккаунт).
create table if not exists public.qd_admins (email text primary key);
alter table public.qd_admins enable row level security;
insert into public.qd_admins (email) values (lower('YOUR_EMAIL')) on conflict do nothing;

create or replace function public.admin_overview() returns jsonb
  language plpgsql security definer set search_path = public, auth as
$$
declare res jsonb;
begin
  if not exists (select 1 from public.qd_admins where email = lower(coalesce(auth.jwt() ->> 'email', ''))) then
    raise exception 'forbidden';
  end if;
  select jsonb_build_object(
    'now', now(),
    'classes', (select count(*) from public.qd_classes),
    'members', (select count(*) from public.qd_members),
    'users', coalesce((
      select jsonb_agg(row_to_json(t) order by t.created_at desc) from (
        select u.id, u.email, u.created_at, u.last_sign_in_at,
               p.display_name as name, p.updated_at as seen,
               coalesce((p.data ->> 'xp')::int, 0) as xp,
               coalesce((p.data ->> 'streak')::int, 0) as streak,
               p.data -> 'profile' ->> 'role' as role,
               (select count(*) from jsonb_object_keys(coalesce(p.data -> 'course' -> 'done', '{}'::jsonb))) as lessons
        from auth.users u left join public.qd_progress p on p.user_id = u.id
        order by u.created_at desc limit 3000
      ) t), '[]'::jsonb)
  ) into res;
  return res;
end
$$;
revoke all on function public.admin_overview() from public, anon;
grant execute on function public.admin_overview() to authenticated;
