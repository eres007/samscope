-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ocaeyapzahotesvybfon/sql

-- Demo Posts table
CREATE TABLE IF NOT EXISTS demo_posts (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    img_url TEXT DEFAULT '',
    link TEXT DEFAULT 'single-demonstration.html',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    hero_title TEXT,
    hero_desc TEXT,
    main_content TEXT,
    scope_title TEXT DEFAULT 'TABLE OF CONTENT',
    scope_items JSONB DEFAULT '[]'::jsonb
);

-- Guide Posts table
CREATE TABLE IF NOT EXISTS guide_posts (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    img_url TEXT DEFAULT '',
    link TEXT DEFAULT 'single-guidelines.html',
    category TEXT DEFAULT 'brand',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    hero_title TEXT,
    hero_desc TEXT,
    main_content TEXT,
    scope_title TEXT DEFAULT 'SCOPE OF WORK',
    scope_items JSONB DEFAULT '[]'::jsonb
);


-- Allow public read (select) for all visitors
ALTER TABLE demo_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read demo_posts" ON demo_posts FOR SELECT USING (true);
CREATE POLICY "Public can insert demo_posts" ON demo_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can delete demo_posts" ON demo_posts FOR DELETE USING (true);

CREATE POLICY "Public can read guide_posts" ON guide_posts FOR SELECT USING (true);
CREATE POLICY "Public can insert guide_posts" ON guide_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can delete guide_posts" ON guide_posts FOR DELETE USING (true);

-- Analytics Table
CREATE TABLE IF NOT EXISTS page_views (
    id BIGSERIAL PRIMARY KEY,
    page_path TEXT,
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert page_views" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read page_views" ON page_views FOR SELECT USING (true);

-- Bookings Table
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
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert consultations" ON consultations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read consultations" ON consultations FOR SELECT USING (true);
CREATE POLICY "Public can delete consultations" ON consultations FOR DELETE USING (true);

-- Storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public image upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'post-images');
CREATE POLICY "Public image read" ON storage.objects FOR SELECT USING (bucket_id = 'post-images');
CREATE POLICY "Public image delete" ON storage.objects FOR DELETE USING (bucket_id = 'post-images');
