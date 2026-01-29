import { useState, useEffect, useCallback } from 'react';
import { supabase, getSessionId, isSupabaseConfigured } from '@/lib/supabase';

export interface DownloadHistoryItem {
    id: string;
    session_id: string;
    analysis_id: string | null;
    file_name: string;
    job_title: string | null;
    score: number;
    downloaded_at: string;
}

const LOCAL_STORAGE_KEY = 'resume_analyzer_download_history';

export function useDownloadHistory() {
    const [history, setHistory] = useState<DownloadHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = useCallback(async () => {
        if (!isSupabaseConfigured() || !supabase) {
            // Fall back to localStorage
            try {
                const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
                setHistory(stored ? JSON.parse(stored) : []);
            } catch {
                setHistory([]);
            }
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const sessionId = getSessionId();

            const { data, error } = await supabase
                .from('download_history')
                .select('*')
                .eq('session_id', sessionId)
                .order('downloaded_at', { ascending: false });

            if (error) throw error;

            setHistory(data || []);
        } catch (err) {
            console.error('Error fetching download history:', err);
            // Fall back to localStorage on error
            try {
                const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
                setHistory(stored ? JSON.parse(stored) : []);
            } catch {
                setHistory([]);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const deleteItem = useCallback(async (id: string) => {
        if (!isSupabaseConfigured() || !supabase) {
            // Delete from localStorage
            const updated = history.filter(item => item.id !== id);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            setHistory(updated);
            return;
        }

        try {
            const { error } = await supabase
                .from('download_history')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setHistory(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error('Error deleting download history item:', err);
            throw err;
        }
    }, [history]);

    const clearAll = useCallback(async () => {
        if (!isSupabaseConfigured() || !supabase) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            setHistory([]);
            return;
        }

        try {
            const sessionId = getSessionId();
            const { error } = await supabase
                .from('download_history')
                .delete()
                .eq('session_id', sessionId);

            if (error) throw error;

            setHistory([]);
        } catch (err) {
            console.error('Error clearing download history:', err);
            throw err;
        }
    }, []);

    return {
        history,
        loading,
        refetch: fetchHistory,
        deleteItem,
        clearAll,
    };
}

// Standalone function to save download history
export async function saveDownloadToHistory(data: {
    fileName: string;
    jobTitle: string;
    score: number;
    analysisId?: string | null;
}): Promise<void> {
    const sessionId = getSessionId();

    const item: DownloadHistoryItem = {
        id: crypto.randomUUID(),
        session_id: sessionId,
        analysis_id: data.analysisId || null,
        file_name: data.fileName,
        job_title: data.jobTitle || null,
        score: data.score,
        downloaded_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured() || !supabase) {
        // Save to localStorage
        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            const existing: DownloadHistoryItem[] = stored ? JSON.parse(stored) : [];
            const updated = [item, ...existing].slice(0, 20); // Keep last 20
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        } catch (err) {
            console.error('Error saving to localStorage:', err);
        }
        return;
    }

    try {
        const { error } = await supabase
            .from('download_history')
            .insert({
                session_id: sessionId,
                analysis_id: data.analysisId || null,
                file_name: data.fileName,
                job_title: data.jobTitle || null,
                score: data.score,
            });

        if (error) throw error;
    } catch (err) {
        console.error('Error saving download to Supabase:', err);
        // Fall back to localStorage
        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            const existing: DownloadHistoryItem[] = stored ? JSON.parse(stored) : [];
            const updated = [item, ...existing].slice(0, 20);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        } catch {
            // Silent fail
        }
    }
}
