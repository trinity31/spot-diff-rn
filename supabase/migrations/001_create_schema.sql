-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_device_id ON users(device_id);

-- Seasons table
CREATE TABLE seasons (
  id INTEGER PRIMARY KEY,
  season_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  total_stages INTEGER NOT NULL,
  difficulty INTEGER NOT NULL,
  illustration_icon TEXT,
  illustration_colors JSONB,
  active BOOLEAN DEFAULT true,
  unlock_condition JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stages table
CREATE TABLE stages (
  id SERIAL PRIMARY KEY,
  season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE,
  stage_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  image_original_url TEXT NOT NULL,
  image_difference_url TEXT NOT NULL,
  differences JSONB NOT NULL,
  difficulty INTEGER DEFAULT 3,
  hint_count INTEGER DEFAULT 3,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(season_id, stage_number)
);

CREATE INDEX idx_stages_season ON stages(season_id);

-- User Progress table
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stage_id INTEGER REFERENCES stages(id) ON DELETE CASCADE,
  cleared BOOLEAN DEFAULT false,
  stars INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  unlocked BOOLEAN DEFAULT false,
  first_played_at TIMESTAMP WITH TIME ZONE,
  cleared_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, stage_id)
);

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_stage ON user_progress(stage_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
