
-- Create table for artist moments (photos of Naveen with his paintings)
CREATE TABLE public.artist_moments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  painting_name TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.artist_moments ENABLE ROW LEVEL SECURITY;

-- Everyone can view moments
CREATE POLICY "Artist moments are viewable by everyone"
  ON public.artist_moments FOR SELECT
  USING (true);

-- Only admins can manage
CREATE POLICY "Admins can insert artist moments"
  ON public.artist_moments FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update artist moments"
  ON public.artist_moments FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete artist moments"
  ON public.artist_moments FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_artist_moments_updated_at
  BEFORE UPDATE ON public.artist_moments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for artist moment images
INSERT INTO storage.buckets (id, name, public) VALUES ('artist-moments', 'artist-moments', true);

-- Storage policies
CREATE POLICY "Artist moment images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'artist-moments');

CREATE POLICY "Admins can upload artist moment images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'artist-moments');

CREATE POLICY "Admins can update artist moment images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'artist-moments');

CREATE POLICY "Admins can delete artist moment images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'artist-moments');
