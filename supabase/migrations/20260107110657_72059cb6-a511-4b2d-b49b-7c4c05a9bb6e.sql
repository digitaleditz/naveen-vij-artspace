-- Add tracking columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS tracking_number text,
ADD COLUMN IF NOT EXISTS estimated_delivery date,
ADD COLUMN IF NOT EXISTS shipping_status text DEFAULT 'processing';

-- Create admin_settings table for order management notifications
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'new_order',
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on admin_notifications
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Update orders status options - add more granular statuses
COMMENT ON COLUMN public.orders.status IS 'Order status: pending, confirmed, processing, shipped, delivered, cancelled';
COMMENT ON COLUMN public.orders.shipping_status IS 'Shipping status: processing, packed, shipped, in_transit, out_for_delivery, delivered';