import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. History will only be stored locally.');
} else {
    // console.log('✅ Supabase configured:', supabaseUrl);
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Session ID for anonymous users - persisted in localStorage
const SESSION_ID_KEY = 'resume_analyzer_session_id';

export function getSessionId(): string {
    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    return sessionId;
}

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
    return supabase !== null;
}
