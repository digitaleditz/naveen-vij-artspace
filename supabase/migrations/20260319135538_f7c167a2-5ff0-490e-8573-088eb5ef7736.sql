INSERT INTO storage.buckets (id, name, public) VALUES ('artwork-images', 'artwork-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view artwork images" ON storage.objects FOR SELECT USING (bucket_id = 'artwork-images');
CREATE POLICY "Admins can upload artwork images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'artwork-images' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update artwork images" ON storage.objects FOR UPDATE USING (bucket_id = 'artwork-images' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete artwork images" ON storage.objects FOR DELETE USING (bucket_id = 'artwork-images' AND has_role(auth.uid(), 'admin'::app_role));