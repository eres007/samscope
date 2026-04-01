-- =============================================
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ocaeyapzahotesvybfon/sql
-- =============================================

-- 1. Create the missing link_clicks table
CREATE TABLE IF NOT EXISTS link_clicks (
    id BIGSERIAL PRIMARY KEY,
    link_url TEXT,
    link_text TEXT,
    page_path TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert link_clicks" ON link_clicks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read link_clicks" ON link_clicks
    FOR SELECT USING (true);

-- 2. Add category column to demo_posts (if not already added)
ALTER TABLE demo_posts
    ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'web';

-- 3. Add missing SEO + meta columns to demo_posts (if not already added)
ALTER TABLE demo_posts
    ADD COLUMN IF NOT EXISTS meta_desc TEXT,
    ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
    ADD COLUMN IF NOT EXISTS show_appointment BOOLEAN DEFAULT true;

-- 4. Add missing SEO + meta columns to guide_posts (if not already added)
ALTER TABLE guide_posts
    ADD COLUMN IF NOT EXISTS meta_desc TEXT,
    ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
    ADD COLUMN IF NOT EXISTS show_appointment BOOLEAN DEFAULT true;

-- Done! All missing tables and columns are now created.
