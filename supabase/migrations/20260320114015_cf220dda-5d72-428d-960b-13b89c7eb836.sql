
CREATE TABLE public.architectural_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.architectural_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Architectural projects are viewable by everyone"
  ON public.architectural_projects FOR SELECT TO public USING (true);

CREATE POLICY "Admins can insert architectural projects"
  ON public.architectural_projects FOR INSERT TO public
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update architectural projects"
  ON public.architectural_projects FOR UPDATE TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete architectural projects"
  ON public.architectural_projects FOR DELETE TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO storage.buckets (id, name, public) VALUES ('architectural-projects', 'architectural-projects', true);

CREATE POLICY "Anyone can view architectural project images"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'architectural-projects');

CREATE POLICY "Admins can upload architectural project images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'architectural-projects' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete architectural project images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'architectural-projects' AND public.has_role(auth.uid(), 'admin'::app_role));
