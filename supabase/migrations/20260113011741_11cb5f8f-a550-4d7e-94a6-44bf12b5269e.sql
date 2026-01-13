-- Create table to track customer loyalty points per distributor
CREATE TABLE public.customer_loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  distributor_id UUID NOT NULL REFERENCES public.distributors(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  redeemed_points INTEGER NOT NULL DEFAULT 0,
  available_points INTEGER GENERATED ALWAYS AS (total_points - redeemed_points) STORED,
  last_order_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(customer_id, distributor_id)
);

-- Enable RLS
ALTER TABLE public.customer_loyalty_points ENABLE ROW LEVEL SECURITY;

-- Customers can view their own points
CREATE POLICY "Customers can view own points"
  ON public.customer_loyalty_points FOR SELECT
  USING (auth.uid() = customer_id);

-- Distributors can view points of their customers
CREATE POLICY "Distributors can view customer points"
  ON public.customer_loyalty_points FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.distributors d
    WHERE d.id = customer_loyalty_points.distributor_id
    AND d.user_id = auth.uid()
  ));

-- Admins can manage all loyalty points
CREATE POLICY "Admins can manage all loyalty points"
  ON public.customer_loyalty_points FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create trigger to update updated_at
CREATE TRIGGER update_customer_loyalty_points_updated_at
  BEFORE UPDATE ON public.customer_loyalty_points
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update customer loyalty points when order is created
CREATE OR REPLACE FUNCTION public.update_customer_loyalty_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if customer is logged in and earned points
  IF NEW.customer_id IS NOT NULL AND NEW.loyalty_points_earned > 0 THEN
    INSERT INTO public.customer_loyalty_points (customer_id, distributor_id, total_points, last_order_at)
    VALUES (NEW.customer_id, NEW.distributor_id, NEW.loyalty_points_earned, NOW())
    ON CONFLICT (customer_id, distributor_id)
    DO UPDATE SET
      total_points = customer_loyalty_points.total_points + NEW.loyalty_points_earned,
      last_order_at = NOW(),
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-update loyalty points after order insert
CREATE TRIGGER trigger_update_loyalty_points
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_customer_loyalty_points();