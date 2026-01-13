-- Add pix_key column to distributors table
ALTER TABLE public.distributors 
ADD COLUMN pix_key TEXT DEFAULT NULL;