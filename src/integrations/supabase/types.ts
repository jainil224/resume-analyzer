export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analyses: {
        Row: {
          ai_suggestions: string[] | null
          ats_score: number
          created_at: string
          experience_score: number
          formatting_score: number
          id: string
          job_description: string
          job_title: string | null
          matched_skills: string[] | null
          missing_skills: string[] | null
          overall_score: number
          resume_name: string
          skills_match: number
          strengths: string[] | null
          user_id: string
          weaknesses: string[] | null
        }
        Insert: {
          ai_suggestions?: string[] | null
          ats_score: number
          created_at?: string
          experience_score: number
          formatting_score: number
          id?: string
          job_description: string
          job_title?: string | null
          matched_skills?: string[] | null
          missing_skills?: string[] | null
          overall_score: number
          resume_name: string
          skills_match: number
          strengths?: string[] | null
          user_id: string
          weaknesses?: string[] | null
        }
        Update: {
          ai_suggestions?: string[] | null
          ats_score?: number
          created_at?: string
          experience_score?: number
          formatting_score?: number
          id?: string
          job_description?: string
          job_title?: string | null
          matched_skills?: string[] | null
          missing_skills?: string[] | null
          overall_score?: number
          resume_name?: string
          skills_match?: number
          strengths?: string[] | null
          user_id?: string
          weaknesses?: string[] | null
        }
        Relationships: []
      }
      candidate_notes: {
        Row: {
          candidate_id: string
          content: string
          created_at: string | null
          id: string
          note_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          candidate_id: string
          content: string
          created_at?: string | null
          id?: string
          note_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          candidate_id?: string
          content?: string
          created_at?: string | null
          id?: string
          note_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_notes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_resumes: {
        Row: {
          ai_suggestions: string[] | null
          analysis_status: string | null
          ats_score: number | null
          candidate_id: string
          created_at: string | null
          education_score: number | null
          experience_score: number | null
          formatting_score: number | null
          grammar_score: number | null
          id: string
          job_description: string | null
          matched_skills: string[] | null
          missing_skills: string[] | null
          overall_score: number | null
          resume_name: string
          resume_text: string | null
          resume_url: string | null
          skills_match: number | null
          strengths: string[] | null
          user_id: string
          version: number | null
          weaknesses: string[] | null
        }
        Insert: {
          ai_suggestions?: string[] | null
          analysis_status?: string | null
          ats_score?: number | null
          candidate_id: string
          created_at?: string | null
          education_score?: number | null
          experience_score?: number | null
          formatting_score?: number | null
          grammar_score?: number | null
          id?: string
          job_description?: string | null
          matched_skills?: string[] | null
          missing_skills?: string[] | null
          overall_score?: number | null
          resume_name: string
          resume_text?: string | null
          resume_url?: string | null
          skills_match?: number | null
          strengths?: string[] | null
          user_id: string
          version?: number | null
          weaknesses?: string[] | null
        }
        Update: {
          ai_suggestions?: string[] | null
          analysis_status?: string | null
          ats_score?: number | null
          candidate_id?: string
          created_at?: string | null
          education_score?: number | null
          experience_score?: number | null
          formatting_score?: number | null
          grammar_score?: number | null
          id?: string
          job_description?: string | null
          matched_skills?: string[] | null
          missing_skills?: string[] | null
          overall_score?: number | null
          resume_name?: string
          resume_text?: string | null
          resume_url?: string | null
          skills_match?: number | null
          strengths?: string[] | null
          user_id?: string
          version?: number | null
          weaknesses?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_resumes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          applied_role: string
          communication_skills: number | null
          created_at: string | null
          education: string | null
          email: string
          experience_years: number | null
          final_remarks: string | null
          hr_notes: string | null
          id: string
          interview_date: string | null
          interview_status: string | null
          name: string
          phone: string | null
          profile_picture_url: string | null
          status: Database["public"]["Enums"]["candidate_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          applied_role: string
          communication_skills?: number | null
          created_at?: string | null
          education?: string | null
          email: string
          experience_years?: number | null
          final_remarks?: string | null
          hr_notes?: string | null
          id?: string
          interview_date?: string | null
          interview_status?: string | null
          name: string
          phone?: string | null
          profile_picture_url?: string | null
          status?: Database["public"]["Enums"]["candidate_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          applied_role?: string
          communication_skills?: number | null
          created_at?: string | null
          education?: string | null
          email?: string
          experience_years?: number | null
          final_remarks?: string | null
          hr_notes?: string | null
          id?: string
          interview_date?: string | null
          interview_status?: string | null
          name?: string
          phone?: string | null
          profile_picture_url?: string | null
          status?: Database["public"]["Enums"]["candidate_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      candidate_status:
        | "pending"
        | "reviewed"
        | "shortlisted"
        | "rejected"
        | "selected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      candidate_status: [
        "pending",
        "reviewed",
        "shortlisted",
        "rejected",
        "selected",
      ],
    },
  },
} as const
