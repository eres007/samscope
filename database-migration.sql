-- RUN THIS SQL IN YOUR SUPABASE SQL EDITOR --

-- 1. Update Content Tables
ALTER TABLE demo_posts 
ADD COLUMN IF NOT EXISTS hero_title TEXT,
ADD COLUMN IF NOT EXISTS hero_desc TEXT,
ADD COLUMN IF NOT EXISTS main_content TEXT,
ADD COLUMN IF NOT EXISTS scope_title TEXT DEFAULT 'TABLE OF CONTENT',
ADD COLUMN IF NOT EXISTS scope_items JSONB DEFAULT '[]'::jsonb;

ALTER TABLE guide_posts 
ADD COLUMN IF NOT EXISTS hero_title TEXT,
ADD COLUMN IF NOT EXISTS hero_desc TEXT,
ADD COLUMN IF NOT EXISTS main_content TEXT,
ADD COLUMN IF NOT EXISTS scope_title TEXT DEFAULT 'TABLE OF CONTENT',
ADD COLUMN IF NOT EXISTS scope_items JSONB DEFAULT '[]'::jsonb;

-- 2. Create Analytics Table
CREATE TABLE IF NOT EXISTS page_views (
    id BIGSERIAL PRIMARY KEY,
    page_path TEXT,
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Bookings Table
CREATE TABLE IF NOT EXISTS consultations (
    id BIGSERIAL PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    whatsapp TEXT,
    service TEXT,
    appointment_date TEXT,
    appointment_time TEXT,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Security & Policies
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert page_views" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read page_views" ON page_views FOR SELECT USING (true);
CREATE POLICY "Public can insert consultations" ON consultations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read consultations" ON consultations FOR SELECT USING (true);
CREATE POLICY "Public can delete consultations" ON consultations FOR DELETE USING (true);
