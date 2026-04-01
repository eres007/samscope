-- Fix schema mismatch for demo_posts and guide_posts
-- Run this in Supabase SQL Editor to add missing columns

-- 1. Updates for demo_posts
ALTER TABLE demo_posts 
ADD COLUMN IF NOT EXISTS hero_title TEXT,
ADD COLUMN IF NOT EXISTS hero_desc TEXT,
ADD COLUMN IF NOT EXISTS scope_title TEXT DEFAULT 'TABLE OF CONTENT',
ADD COLUMN IF NOT EXISTS main_content TEXT,
ADD COLUMN IF NOT EXISTS scope_items JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS show_appointment BOOLEAN DEFAULT TRUE;

-- 2. Updates for guide_posts
ALTER TABLE guide_posts 
ADD COLUMN IF NOT EXISTS hero_title TEXT,
ADD COLUMN IF NOT EXISTS hero_desc TEXT,
ADD COLUMN IF NOT EXISTS scope_items JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS show_appointment BOOLEAN DEFAULT TRUE;

-- 3. Ensure SEO columns exist
ALTER TABLE demo_posts 
ADD COLUMN IF NOT EXISTS meta_desc TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT;

ALTER TABLE guide_posts 
ADD COLUMN IF NOT EXISTS meta_desc TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT;

-- 4. Fix existing rows (if you previously ran the script with FALSE)
UPDATE demo_posts SET show_appointment = TRUE WHERE show_appointment IS FALSE;
UPDATE guide_posts SET show_appointment = TRUE WHERE show_appointment IS FALSE;
