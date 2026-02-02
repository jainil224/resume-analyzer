import { useState, useEffect, useCallback } from 'react';
import { supabase, getSessionId, isSupabaseConfigured } from '@/lib/supabase';

export interface AnalysisRecord {
    id: string;
    resume_name: string;
    job_title: string | null;
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
}

export function useAnalysisHistory() {
    const [history, setHistory] = useState<AnalysisRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        if (!isSupabaseConfigured() || !supabase) {
            // Fall back to localStorage
            const stored = localStorage.getItem('lovable_local_candidates');
            if (stored) {
                try {
                    const localData = JSON.parse(stored);
                    const mapped: AnalysisRecord[] = localData.map((c: any) => ({
                        id: c.id,
                        resume_name: c.name,
                        job_title: c.applied_role,
                        overall_score: c.latestScore || 0,
                        skills_match: (c.matchedSkills?.length || 0) * 10,
                        experience_score: 80,
                        ats_score: c.latestScore || 0,
                        formatting_score: 90,
                        matched_skills: c.matchedSkills || [],
                        missing_skills: c.missingSkills || [],
                        strengths: c.strengths || [],
                        weaknesses: c.weaknesses || [],
                        ai_suggestions: c.aiSuggestions || [],
                        created_at: c.created_at,
                    }));
                    setHistory(mapped);
                } catch {
                    setHistory([]);
                }
            }
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const sessionId = getSessionId();

            const { data, error: fetchError } = await supabase
                .from('analysis_history')
                .select('*')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            // Map data to AnalysisRecord format
            const records: AnalysisRecord[] = (data || []).map((row: any) => ({
                id: row.id,
                resume_name: row.resume_name,
                job_title: row.job_title,
                overall_score: row.overall_score,
                skills_match: row.skills_match,
                experience_score: row.experience_score,
                ats_score: row.ats_score,
                formatting_score: row.formatting_score,
                matched_skills: row.matched_skills || [],
                missing_skills: row.missing_skills || [],
                strengths: row.strengths || [],
                weaknesses: row.weaknesses || [],
                ai_suggestions: row.ai_suggestions || [],
                created_at: row.created_at,
            }));

            setHistory(records);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching analysis history:', err);
            setError(err.message || 'Failed to fetch history');
            setHistory([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const deleteAnalysis = useCallback(async (id: string) => {
        if (!isSupabaseConfigured() || !supabase) {
            // Delete from localStorage
            const stored = localStorage.getItem('lovable_local_candidates');
            if (stored) {
                const localData = JSON.parse(stored);
                const updated = localData.filter((c: any) => c.id !== id);
                localStorage.setItem('lovable_local_candidates', JSON.stringify(updated));
                setHistory(prev => prev.filter(h => h.id !== id));
            }
            return;
        }

        try {
            const { error: deleteError } = await supabase
                .from('analysis_history')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            setHistory(prev => prev.filter(h => h.id !== id));
        } catch (err: any) {
            console.error('Error deleting analysis:', err);
            throw err;
        }
    }, []);

    const deleteAnalyses = useCallback(async (ids: string[]) => {
        if (!isSupabaseConfigured() || !supabase) {
            // Delete from localStorage
            const stored = localStorage.getItem('lovable_local_candidates');
            if (stored) {
                const localData = JSON.parse(stored);
                // Filter out any record whose id is in the ids array
                const updated = localData.filter((c: any) => !ids.includes(c.id));
                localStorage.setItem('lovable_local_candidates', JSON.stringify(updated));
                setHistory(prev => prev.filter(h => !ids.includes(h.id)));
            }
            return;
        }

        try {
            const { error: deleteError } = await supabase
                .from('analysis_history')
                .delete()
                .in('id', ids);

            if (deleteError) throw deleteError;

            setHistory(prev => prev.filter(h => !ids.includes(h.id)));
        } catch (err: any) {
            console.error('Error deleting analyses:', err);
            throw err;
        }
    }, []);

    return {
        history,
        loading,
        error,
        refetch: fetchHistory,
        deleteAnalysis,
        deleteAnalyses,
    };
}

// Standalone function to save analysis (used in Analyze.tsx)
export async function saveAnalysisToSupabase(data: {
    resumeName: string;
    jobTitle: string;
    jobDescription: string;
    resumeText: string;
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
}): Promise<string | null> {
    if (!isSupabaseConfigured() || !supabase) {
        return null; // Will fall back to localStorage
    }

    const sessionId = getSessionId();

    const insertData = {
        session_id: sessionId,
        resume_name: data.resumeName,
        job_title: data.jobTitle || null,
        job_description: data.jobDescription || null,
        resume_text: data.resumeText || null,
        overall_score: data.overall_score,
        skills_match: data.skills_match,
        experience_score: data.experience_score,
        ats_score: data.ats_score,
        formatting_score: data.formatting_score,
        matched_skills: data.matched_skills,
        missing_skills: data.missing_skills,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        ai_suggestions: data.ai_suggestions,
    };

    const { data: inserted, error } = await supabase
        .from('analysis_history')
        .insert(insertData)
        .select('id')
        .single();

    if (error) {
        console.error('Error saving to Supabase:', error);
        return null;
    }

    // console.log('✅ Successfully saved to Supabase, id:', inserted?.id);
    return inserted?.id || null;
}
