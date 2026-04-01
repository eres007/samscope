-- Run this in Supabase SQL Editor to authorize updates and fixes
-- This is critical for the "changes not staying" issue.

-- Enable UPDATE for demo_posts
CREATE POLICY "Public can update demo_posts" ON demo_posts
FOR UPDATE USING (true) WITH CHECK (true);

-- Enable UPDATE for guide_posts
CREATE POLICY "Public can update guide_posts" ON guide_posts
FOR UPDATE USING (true) WITH CHECK (true);

-- Ensure storage policies are correct for deletions and updates
CREATE POLICY "Public image update" ON storage.objects
FOR UPDATE WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "Public image delete" ON storage.objects
FOR DELETE USING (bucket_id = 'post-images');
