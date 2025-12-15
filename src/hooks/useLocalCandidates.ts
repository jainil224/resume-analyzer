import { useState, useEffect } from "react";

export interface LocalCandidate {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  applied_role: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "selected";
  created_at: string;
  updated_at: string;
  education: string | null;
  experience_years: number;
  profile_picture_url: string | null;
  interview_date: string | null;
  interview_status: string;
  latestScore?: number;
  analysisStatus?: string;
  matchedSkills?: string[];
  resumeText?: string;
  jobDescription?: string;
  strengths?: string[];
  weaknesses?: string[];
  missingSkills?: string[];
  aiSuggestions?: string[];
}

const LOCAL_STORAGE_KEY = "lovable_local_candidates";

export function useLocalCandidates() {
  const [localCandidates, setLocalCandidates] = useState<LocalCandidate[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setLocalCandidates(JSON.parse(stored));
      } catch {
        setLocalCandidates([]);
      }
    }
  }, []);

  const saveCandidate = (candidate: LocalCandidate) => {
    const updated = [candidate, ...localCandidates];
    setLocalCandidates(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteCandidate = (id: string) => {
    const updated = localCandidates.filter(c => c.id !== id);
    setLocalCandidates(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const updateCandidate = (id: string, updates: Partial<LocalCandidate>) => {
    const updated = localCandidates.map(c => 
      c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
    );
    setLocalCandidates(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const clearLocalCandidates = () => {
    setLocalCandidates([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return {
    localCandidates,
    saveCandidate,
    deleteCandidate,
    updateCandidate,
    clearLocalCandidates,
  };
}

export function saveLocalCandidate(candidate: LocalCandidate) {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  const existing: LocalCandidate[] = stored ? JSON.parse(stored) : [];
  const updated = [candidate, ...existing];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
}
