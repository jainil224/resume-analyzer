-- ============================================
-- RESUME ANALYZER - SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create analysis_history table
CREATE TABLE IF NOT EXISTS analysis_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  resume_name TEXT NOT NULL,
  job_title TEXT,
  job_description TEXT,
  resume_text TEXT,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  skills_match INTEGER DEFAULT 0,
  experience_score INTEGER DEFAULT 0,
  ats_score INTEGER DEFAULT 0,
  formatting_score INTEGER DEFAULT 0,
  matched_skills JSONB DEFAULT '[]'::jsonb,
  missing_skills JSONB DEFAULT '[]'::jsonb,
  strengths JSONB DEFAULT '[]'::jsonb,
  weaknesses JSONB DEFAULT '[]'::jsonb,
  ai_suggestions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create download_history table
CREATE TABLE IF NOT EXISTS download_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  analysis_id UUID REFERENCES analysis_history(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  job_title TEXT,
  score INTEGER NOT NULL,
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_analysis_history_session ON analysis_history(session_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_created ON analysis_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_download_history_session ON download_history(session_id);
CREATE INDEX IF NOT EXISTS idx_download_history_downloaded ON download_history(downloaded_at DESC);

-- 4. Enable Row Level Security
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_history ENABLE ROW LEVEL SECURITY;

-- 5. Create policies (allow all for anonymous access)
CREATE POLICY "Allow anonymous read" ON analysis_history FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON analysis_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON analysis_history FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete" ON analysis_history FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read" ON download_history FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON download_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous delete" ON download_history FOR DELETE USING (true);

-- 6. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Apply trigger to analysis_history
DROP TRIGGER IF EXISTS update_analysis_history_updated_at ON analysis_history;
CREATE TRIGGER update_analysis_history_updated_at
  BEFORE UPDATE ON analysis_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Done! Your tables are ready.
-- Copy your Supabase URL and anon key to .env file
