CREATE TABLE IF NOT EXISTS visitors (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('unknown', 'human', 'agent')),
  agent TEXT,
  model TEXT,
  detected_agent TEXT,
  identity_source TEXT NOT NULL,
  first_seen INTEGER NOT NULL,
  last_seen INTEGER NOT NULL,
  checkins INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS visitors_last_seen ON visitors(last_seen DESC);

CREATE TABLE IF NOT EXISTS checkins (
  id TEXT PRIMARY KEY,
  visitor_id TEXT NOT NULL REFERENCES visitors(id),
  kind TEXT NOT NULL,
  agent TEXT,
  at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS checkins_at ON checkins(at);

CREATE TABLE IF NOT EXISTS runs (
  id TEXT PRIMARY KEY,
  visitor_id TEXT NOT NULL REFERENCES visitors(id),
  day TEXT NOT NULL,
  observations TEXT NOT NULL DEFAULT '[]',
  probes_used INTEGER NOT NULL DEFAULT 0 CHECK (probes_used BETWEEN 0 AND 5),
  best_score REAL NOT NULL DEFAULT 0 CHECK (best_score BETWEEN 0 AND 100),
  started_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  completed_at INTEGER,
  UNIQUE(visitor_id, day)
);
CREATE INDEX IF NOT EXISTS runs_leaderboard ON runs(day, probes_used, best_score DESC);

CREATE TABLE IF NOT EXISTS rate_buckets (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
