-- Update RLS policies to allow proper visibility for Contact page

-- Drop existing policy for viewing profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create new policies for profile visibility
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Students can view counselors" 
ON public.profiles 
FOR SELECT 
USING (
  user_type = 'counselor' 
  AND EXISTS (
    SELECT 1 FROM public.profiles AS user_profile 
    WHERE user_profile.id = auth.uid() 
    AND user_profile.user_type = 'student'
  )
);

CREATE POLICY "Counselors can view critical students" 
ON public.profiles 
FOR SELECT 
USING (
  user_type = 'student' 
  AND quiz_result = 'Critical'
  AND EXISTS (
    SELECT 1 FROM public.profiles AS user_profile 
    WHERE user_profile.id = auth.uid() 
    AND user_profile.user_type = 'counselor'
  )
);