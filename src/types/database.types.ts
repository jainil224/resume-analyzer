export interface Database {
    public: {
        Tables: {
            analysis_history: {
                Row: {
                    id: string;
                    session_id: string;
                    resume_name: string;
                    job_title: string | null;
                    job_description: string | null;
                    resume_text: string | null;
                    overall_score: number;
                    skills_match: number;
                    experience_score: number;
                    ats_score: number;
                    formatting_score: number;
                    matched_skills: string[];
                    missing_skills: string[];
                    strengths: string[];
                    weaknesses: string[];
                    ai_suggestions: string[];
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    session_id: string;
                    resume_name: string;
                    job_title?: string | null;
                    job_description?: string | null;
                    resume_text?: string | null;
                    overall_score: number;
                    skills_match?: number;
                    experience_score?: number;
                    ats_score?: number;
                    formatting_score?: number;
                    matched_skills?: string[];
                    missing_skills?: string[];
                    strengths?: string[];
                    weaknesses?: string[];
                    ai_suggestions?: string[];
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    session_id?: string;
                    resume_name?: string;
                    job_title?: string | null;
                    job_description?: string | null;
                    resume_text?: string | null;
                    overall_score?: number;
                    skills_match?: number;
                    experience_score?: number;
                    ats_score?: number;
                    formatting_score?: number;
                    matched_skills?: string[];
                    missing_skills?: string[];
                    strengths?: string[];
                    weaknesses?: string[];
                    ai_suggestions?: string[];
                    created_at?: string;
                    updated_at?: string;
                };
            };
            download_history: {
                Row: {
                    id: string;
                    session_id: string;
                    analysis_id: string | null;
                    file_name: string;
                    job_title: string | null;
                    score: number;
                    downloaded_at: string;
                };
                Insert: {
                    id?: string;
                    session_id: string;
                    analysis_id?: string | null;
                    file_name: string;
                    job_title?: string | null;
                    score: number;
                    downloaded_at?: string;
                };
                Update: {
                    id?: string;
                    session_id?: string;
                    analysis_id?: string | null;
                    file_name?: string;
                    job_title?: string | null;
                    score?: number;
                    downloaded_at?: string;
                };
            };
        };
    };
}

export type AnalysisHistory = Database['public']['Tables']['analysis_history']['Row'];
export type AnalysisHistoryInsert = Database['public']['Tables']['analysis_history']['Insert'];
export type DownloadHistory = Database['public']['Tables']['download_history']['Row'];
export type DownloadHistoryInsert = Database['public']['Tables']['download_history']['Insert'];
