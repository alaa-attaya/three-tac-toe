-- ENUM: player roles
create type player_role as enum ('X', 'O');

-- =====================================
-- ============ TABLES =================
-- =====================================

-- GAMES TABLE
create table public.games (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique check (length(room_code) = 4),
  created_at timestamp with time zone default now(),
  status text not null default 'waiting', 
  winner player_role, 
  player_x uuid not null references auth.users(id),  -- creator
  player_o uuid null references auth.users(id)       -- nullable, joins later
);

create index on public.games (room_code);

-- MOVES TABLE
create table public.moves (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  player player_role not null,
  board jsonb not null, 
  created_at timestamp with time zone default now()
);

create index on public.moves (game_id);
create index on public.moves (created_at);

-- =====================================
-- ==== TRIGGER: auto-generate room_code
-- =====================================

-- Function to assign a unique 4-character hex code
create or replace function assign_room_code()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  new_code text;
  try_count int := 0;
begin
  loop
    try_count := try_count + 1;
    exit when try_count > 10;

    new_code := lpad(to_hex(floor(random() * 65536)::int), 4, '0');

    -- Ensure uniqueness
    exit when not exists (
      select 1 from public.games where room_code = new_code
    );
  end loop;

  if try_count > 10 then
    raise exception 'Failed to generate unique room code';
  end if;

  new.room_code := new_code;
  return new;
end;
$$;

-- Trigger to auto-generate room_code if not provided
create trigger set_room_code
before insert on public.games
for each row
when (new.room_code is null)
execute function assign_room_code();

-- =====================================
-- ============= RPCs ==================
-- =====================================

-- Make a move
create or replace function public.make_move(
  room_code text,
  player player_role,
  board jsonb
) returns void
language plpgsql
set search_path = public, pg_temp
as $$
declare
  game_id uuid;
begin
  select id into game_id from public.games where room_code = make_move.room_code;

  if game_id is null then
    raise exception 'Invalid room code';
  end if;

  insert into public.moves (game_id, player, board)
  values (game_id, make_move.player, make_move.board);
end;
$$;

-- Join an open room
create or replace function public.join_room(
  room_code text,
  user_id uuid
) returns void
language plpgsql
set search_path = public, pg_temp
as $$
declare
  game_record record;
begin
  select * into game_record from public.games where room_code = join_room.room_code;

  if game_record is null then
    raise exception 'Invalid room code';
  end if;

  if game_record.player_o is not null then
    raise exception 'Room already has player O';
  end if;

  update public.games
  set player_o = join_room.user_id,
      status = 'in_progress'
  where id = game_record.id;
end;
$$;

-- Leave a room
create or replace function public.leave_room(
  room_code text,
  user_id uuid
) returns void
language plpgsql
set search_path = public, pg_temp
as $$
declare
  game_record record;
begin
  select * into game_record from public.games where room_code = leave_room.room_code;

  if game_record is null then
    raise exception 'Invalid room code';
  end if;

  -- If creator leaves, delete the game
  if game_record.player_x = leave_room.user_id then
    delete from public.games where id = game_record.id;
    return;
  end if;

  -- If opponent leaves, reset player_o and status
  if game_record.player_o = leave_room.user_id then
    update public.games
    set player_o = null,
        status = 'waiting'
    where id = game_record.id;
    return;
  end if;

  raise exception 'User not part of the game';
end;
$$;

-- =====================================
-- =========== RLS + POLICIES ==========
-- =====================================

-- Enable Row-Level Security
alter table public.games enable row level security;
alter table public.moves enable row level security;

-- Games policy: Only authenticated players in the game can access it
create policy "Allow authenticated players on games" on public.games
  for all
  using (
    auth.uid() IS NOT NULL AND
    (player_x = auth.uid() OR player_o = auth.uid())
  );

-- Moves policy: Only players in the associated game can access moves
create policy "Allow authenticated players on moves" on public.moves
  for all
  using (
    auth.uid() IS NOT NULL AND
    exists (
      select 1 from public.games
      where id = public.moves.game_id
        and (player_x = auth.uid() or player_o = auth.uid())
    )
  );

-- =====================================
-- ============= OWNERSHIP =============
-- =====================================

alter function public.make_move(text, player_role, jsonb) owner to postgres;
alter function public.join_room(text, uuid) owner to postgres;
alter function public.leave_room(text, uuid) owner to postgres;
alter function assign_room_code() owner to postgres;
