-- Update the profiles table to match our current needs and add quiz results
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS quiz_score INTEGER,
ADD COLUMN IF NOT EXISTS quiz_result TEXT CHECK (quiz_result IN ('Mild', 'Moderate', 'Critical')),
ADD COLUMN IF NOT EXISTS quiz_timestamp TIMESTAMP WITH TIME ZONE;

-- Create index for better performance on quiz queries
CREATE INDEX IF NOT EXISTS idx_profiles_quiz_result ON public.profiles(quiz_result);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);

-- Enable realtime for profiles table
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add profiles to realtime publication
ALTER publication supabase_realtime ADD TABLE public.profiles;

-- Enable realtime for conversations table
ALTER TABLE public.conversations REPLICA IDENTITY FULL;

-- Add conversations to realtime publication  
ALTER publication supabase_realtime ADD TABLE public.conversations;

-- Enable realtime for messages table
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Add messages to realtime publication
ALTER publication supabase_realtime ADD TABLE public.messages;

-- Create trigger to automatically update updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();