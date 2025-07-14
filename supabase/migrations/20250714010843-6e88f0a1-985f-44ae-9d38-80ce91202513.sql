-- Update the profiles table to add quiz results columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS quiz_score INTEGER,
ADD COLUMN IF NOT EXISTS quiz_result TEXT CHECK (quiz_result IN ('Mild', 'Moderate', 'Critical')),
ADD COLUMN IF NOT EXISTS quiz_timestamp TIMESTAMP WITH TIME ZONE;

-- Create index for better performance on quiz queries
CREATE INDEX IF NOT EXISTS idx_profiles_quiz_result ON public.profiles(quiz_result);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);

-- Enable realtime for profiles table
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Enable realtime for messages table  
ALTER TABLE public.messages REPLICA IDENTITY FULL;