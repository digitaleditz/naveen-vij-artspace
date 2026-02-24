
DROP POLICY "Artworks are viewable by everyone" ON public.artworks;
CREATE POLICY "Artworks are viewable by everyone" ON public.artworks FOR SELECT USING (true);
