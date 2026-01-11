-- Add last_visit column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_visit timestamp with time zone DEFAULT now();

-- Create RLS policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policy for admins to view all orders (already exists, skip if error)
-- Just ensuring admins have full access

-- Create a function to update last_visit on auth
CREATE OR REPLACE FUNCTION public.update_last_visit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles 
  SET last_visit = now() 
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$;