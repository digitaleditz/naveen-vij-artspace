ALTER TABLE public.exhibitions
ADD COLUMN images text[] NOT NULL DEFAULT '{}';

UPDATE public.exhibitions
SET images = ARRAY[image_url]
WHERE image_url IS NOT NULL AND image_url <> '' AND cardinality(images) = 0;