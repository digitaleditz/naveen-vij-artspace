-- Add RLS policy for admins to view all inquiries
CREATE POLICY "Admins can view all inquiries"
ON public.inquiries
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));