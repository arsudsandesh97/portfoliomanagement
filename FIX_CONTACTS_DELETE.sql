-- Run this in your Supabase SQL Editor to allow deleting contacts

-- 1. Enable RLS (if not already enabled)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy to allow ANYONE to delete contacts (easiest fix for local dev)
CREATE POLICY "Allow delete for everyone" ON contacts
FOR DELETE
TO public
USING (true);

-- Note: If you want to restrict this to logged-in users only, use this instead:
-- CREATE POLICY "Allow delete for authenticated users" ON contacts
-- FOR DELETE
-- TO authenticated
-- USING (true);
