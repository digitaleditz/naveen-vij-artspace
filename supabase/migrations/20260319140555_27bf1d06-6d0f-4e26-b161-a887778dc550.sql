
CREATE TABLE public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collections are viewable by everyone" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Admins can insert collections" ON public.collections FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update collections" ON public.collections FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete collections" ON public.collections FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
