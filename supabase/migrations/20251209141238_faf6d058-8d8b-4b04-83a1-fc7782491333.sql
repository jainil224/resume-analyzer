-- Add interview tracking fields to candidates table
ALTER TABLE public.candidates 
ADD COLUMN IF NOT EXISTS education text,
ADD COLUMN IF NOT EXISTS experience_years integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS profile_picture_url text,
ADD COLUMN IF NOT EXISTS interview_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS interview_status text DEFAULT 'not_scheduled',
ADD COLUMN IF NOT EXISTS hr_notes text,
ADD COLUMN IF NOT EXISTS communication_skills integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS final_remarks text;

-- Add analysis_status to candidate_resumes to track scan status
ALTER TABLE public.candidate_resumes
ADD COLUMN IF NOT EXISTS analysis_status text DEFAULT 'pending';

-- Create index for better filtering
CREATE INDEX IF NOT EXISTS idx_candidates_experience ON public.candidates(experience_years);
CREATE INDEX IF NOT EXISTS idx_candidates_interview_status ON public.candidates(interview_status);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON public.candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_phone ON public.candidates(phone);