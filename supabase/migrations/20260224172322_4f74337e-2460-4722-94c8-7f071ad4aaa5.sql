
-- Table to store static site asset overrides (hero image, portrait, etc.)
CREATE TABLE public.site_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_key TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_assets ENABLE ROW LEVEL SECURITY;

-- Everyone can view site assets
CREATE POLICY "Site assets are viewable by everyone"
  ON public.site_assets FOR SELECT
  USING (true);

-- Only admins can manage
CREATE POLICY "Admins can insert site assets"
  ON public.site_assets FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site assets"
  ON public.site_assets FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site assets"
  ON public.site_assets FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_site_assets_updated_at
  BEFORE UPDATE ON public.site_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for site assets
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true);

CREATE POLICY "Site asset images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');

CREATE POLICY "Admins can upload site asset images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Admins can update site asset images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'site-assets');

CREATE POLICY "Admins can delete site asset images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-assets');
