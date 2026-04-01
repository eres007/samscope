-- Add SEO columns to content tables
ALTER TABLE demo_posts 
ADD COLUMN IF NOT EXISTS meta_desc TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT;

ALTER TABLE guide_posts 
ADD COLUMN IF NOT EXISTS meta_desc TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT;
