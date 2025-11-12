-- Function to get user names from auth.users
-- This function allows us to query user metadata from the public schema
CREATE OR REPLACE FUNCTION public.get_user_names(user_ids uuid[])
RETURNS TABLE(user_id uuid, name text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id as user_id,
    COALESCE(
      (au.raw_user_meta_data->>'name')::text,
      (au.raw_user_meta_data->>'full_name')::text
    ) as name
  FROM auth.users au
  WHERE au.id = ANY(user_ids);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_names(uuid[]) TO authenticated;

