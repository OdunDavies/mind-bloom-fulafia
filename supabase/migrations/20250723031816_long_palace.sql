/*
  # User Authentication and Profile Setup

  1. New Tables
    - `profiles` table is already created, but we'll ensure it's properly configured for auth
    - Add trigger to automatically create profile when user signs up
    
  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users
    - Create trigger function for new user profile creation
    
  3. Authentication
    - Configure auth.users integration with profiles table
    - Set up automatic profile creation on signup
*/

-- Create or update the profiles table to work with Supabase auth
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('student', 'counselor')),
  age integer,
  gender text,
  department text,
  specialty text,
  bio text,
  availability text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  quiz_score integer,
  quiz_result text CHECK (quiz_result IN ('Mild', 'Moderate', 'Critical')),
  quiz_timestamp timestamptz,
  is_online boolean DEFAULT false,
  last_seen timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy for students to view counselors
CREATE POLICY "Students can view counselors"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    user_type = 'counselor' 
    AND EXISTS (
      SELECT 1 FROM profiles user_profile 
      WHERE user_profile.id = auth.uid() 
      AND user_profile.user_type = 'student'
    )
  );

-- Policy for counselors to view students (especially critical ones)
CREATE POLICY "Counselors can view students"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    user_type = 'student' 
    AND EXISTS (
      SELECT 1 FROM profiles user_profile 
      WHERE user_profile.id = auth.uid() 
      AND user_profile.user_type = 'counselor'
    )
  );

-- Create trigger function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_quiz_result ON profiles(quiz_result);
CREATE INDEX IF NOT EXISTS idx_profiles_is_online ON profiles(is_online);