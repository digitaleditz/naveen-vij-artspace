ALTER TABLE public.architectural_projects
  ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS description text;

UPDATE public.architectural_projects
SET images = ARRAY[image_url]
WHERE (images IS NULL OR array_length(images, 1) IS NULL) AND image_url IS NOT NULL;