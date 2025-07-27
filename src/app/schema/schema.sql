-- ENUMS for game modes and status
CREATE TYPE game_mode AS ENUM ('multiplayer_online', 'multiplayer_local', 'computer');
CREATE TYPE game_status AS ENUM ('in_progress', 'completed');

-- Trigger function to auto-update 'updated_at' timestamp with fixed search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_catalog;

-- PROFILES table: stores user info and stats
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL CHECK (length(username) > 2),
  wins_multiplayer_online INT DEFAULT 0,
  losses_multiplayer_online INT DEFAULT 0,
  draws_multiplayer_online INT DEFAULT 0,
  wins_multiplayer_local INT DEFAULT 0,
  losses_multiplayer_local INT DEFAULT 0,
  draws_multiplayer_local INT DEFAULT 0,
  wins_computer INT DEFAULT 0,
  losses_computer INT DEFAULT 0,
  draws_computer INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  misc JSONB DEFAULT '{}'::jsonb
);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE TRIGGER set_updated_at_profiles
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- GAMES table: tracks games metadata, current turn, winner, draw status
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  mode game_mode NOT NULL,
  winner_id UUID REFERENCES profiles(id),
  is_draw BOOLEAN DEFAULT FALSE,
  status game_status DEFAULT 'in_progress',
  current_turn_user_id UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_mode ON games(mode);
CREATE INDEX idx_games_winner_id ON games(winner_id);
CREATE TRIGGER set_updated_at_games
BEFORE UPDATE ON games
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- GAME PARTICIPANTS table: players in each game, with side and computer flag
CREATE TABLE game_participants (
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  side TEXT CHECK (side IN ('X', 'O')) NOT NULL,
  is_computer BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (game_id, user_id)
);
CREATE INDEX idx_game_participants_user_id ON game_participants(user_id);
CREATE INDEX idx_game_participants_game_id ON game_participants(game_id);

-- GAME MOVES table: logs each move with full board snapshot
CREATE TABLE game_moves (
  id SERIAL PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  turn_number INT NOT NULL,
  board_state JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_game_moves_game_id ON game_moves(game_id);
CREATE INDEX idx_game_moves_user_id ON game_moves(user_id);

-- LEADERBOARD table: aggregated stats for quick leaderboard queries
CREATE TABLE leaderboard (
  profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  total_wins INT DEFAULT 0,
  total_losses INT DEFAULT 0,
  total_draws INT DEFAULT 0,
  last_played TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_leaderboard_last_played ON leaderboard(last_played);
CREATE TRIGGER set_updated_at_leaderboard
BEFORE UPDATE ON leaderboard
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ENABLE RLS on all user-data tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles
CREATE POLICY "Users can select their own profile"
  ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (id = auth.uid());

-- Games
CREATE POLICY "Users can see games they participate in"
  ON games FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM game_participants gp WHERE gp.game_id = games.id AND gp.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert games"
  ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update games they participate in"
  ON games FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM game_participants gp WHERE gp.game_id = games.id AND gp.user_id = auth.uid()
    )
  );

-- Game Participants
CREATE POLICY "Users can select their own game participations"
  ON game_participants FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own game participation"
  ON game_participants FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own game participation"
  ON game_participants FOR UPDATE USING (user_id = auth.uid());

-- Game Moves
CREATE POLICY "Users can select their own game moves"
  ON game_moves FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM game_participants gp WHERE gp.game_id = game_moves.game_id AND gp.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert their own game moves"
  ON game_moves FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM game_participants gp WHERE gp.game_id = game_moves.game_id AND gp.user_id = auth.uid()
    )
  );


-- Leaderboard
CREATE POLICY "Users can select their own leaderboard entry"
  ON leaderboard FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can insert leaderboard entries"
  ON leaderboard FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Users can update their own leaderboard entry"
  ON leaderboard FOR UPDATE USING (profile_id = auth.uid());
