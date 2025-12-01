-- Function to get active sessions for the current user
create or replace function public.get_my_sessions()
returns table (
  id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  user_agent text,
  ip text
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  -- Note: auth.sessions does not natively store UA/IP in all Supabase versions/configurations.
  -- If your Supabase instance doesn't have these columns in auth.sessions, this might fail or return null.
  -- Standard Supabase auth.sessions has: id, user_id, created_at, updated_at, factor_id, aal, not_after
  -- It does NOT usually have ip or user_agent.
  -- So we will return what we can, and maybe join with refresh_tokens if possible, but refresh_tokens is also limited.
  -- For now, we'll just return the basic info.
  
  return query
  select 
    s.id, 
    s.created_at, 
    s.updated_at,
    'Unknown'::text as user_agent, -- Placeholder as we can't easily get this
    'Unknown'::text as ip          -- Placeholder
  from auth.sessions s
  where s.user_id = auth.uid()
  order by s.created_at desc;
end;
$$;

-- Function to revoke a specific session
create or replace function public.revoke_session(session_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  delete from auth.sessions
  where id = session_id and user_id = auth.uid();
end;
$$;

-- Function to revoke all other sessions
create or replace function public.revoke_other_sessions(current_session_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  delete from auth.sessions
  where user_id = auth.uid() and id != current_session_id;
end;
$$;
