-- Allow users to insert their own customer role during signup
CREATE POLICY "Users can insert own customer role"
ON public.user_roles
FOR INSERT
WITH CHECK ((auth.uid() = user_id) AND (role = 'customer'::app_role));