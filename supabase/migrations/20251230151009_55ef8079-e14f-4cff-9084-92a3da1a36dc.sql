-- Allow users to insert their own distributor role during signup
CREATE POLICY "Users can insert own distributor role"
ON public.user_roles
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND 
  role = 'distributor'::app_role
);