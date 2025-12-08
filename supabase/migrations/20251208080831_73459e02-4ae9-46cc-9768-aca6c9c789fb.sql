
-- Create enum for candidate status
CREATE TYPE public.candidate_status AS ENUM ('pending', 'reviewed', 'shortlisted', 'rejected', 'selected');

-- Create candidates table
CREATE TABLE public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  applied_role TEXT NOT NULL,
  status candidate_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create candidate_resumes table for multiple resume versions
CREATE TABLE public.candidate_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version INTEGER DEFAULT 1,
  resume_name TEXT NOT NULL,
  resume_url TEXT,
  resume_text TEXT,
  overall_score INTEGER DEFAULT 0,
  skills_match INTEGER DEFAULT 0,
  experience_score INTEGER DEFAULT 0,
  education_score INTEGER DEFAULT 0,
  ats_score INTEGER DEFAULT 0,
  formatting_score INTEGER DEFAULT 0,
  grammar_score INTEGER DEFAULT 0,
  matched_skills TEXT[] DEFAULT '{}',
  missing_skills TEXT[] DEFAULT '{}',
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  ai_suggestions TEXT[] DEFAULT '{}',
  job_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create candidate_notes table for admin feedback
CREATE TABLE public.candidate_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_type TEXT DEFAULT 'general',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for candidates
CREATE POLICY "Users can view their own candidates" ON public.candidates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own candidates" ON public.candidates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own candidates" ON public.candidates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own candidates" ON public.candidates
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for candidate_resumes
CREATE POLICY "Users can view their own candidate resumes" ON public.candidate_resumes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own candidate resumes" ON public.candidate_resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own candidate resumes" ON public.candidate_resumes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own candidate resumes" ON public.candidate_resumes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for candidate_notes
CREATE POLICY "Users can view their own candidate notes" ON public.candidate_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own candidate notes" ON public.candidate_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own candidate notes" ON public.candidate_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own candidate notes" ON public.candidate_notes
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Storage policies
CREATE POLICY "Users can upload their own resumes" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own resumes" ON storage.objects
  FOR SELECT USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own resumes" ON storage.objects
  FOR DELETE USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON public.candidates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_candidate_notes_updated_at
  BEFORE UPDATE ON public.candidate_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
