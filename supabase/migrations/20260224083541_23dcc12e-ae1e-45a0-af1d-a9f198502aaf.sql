
-- Add social_media_link column to people table
ALTER TABLE public.people ADD COLUMN social_media_link text DEFAULT '';

-- Delete all existing dummy data
DELETE FROM public.people;
