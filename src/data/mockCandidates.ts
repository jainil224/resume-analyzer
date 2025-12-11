// Mock data for demo mode - shows all features without requiring login

export const mockCandidates = [
  {
    id: "demo-1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 555-0123",
    applied_role: "Senior Software Engineer",
    status: "shortlisted" as const,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    education: "M.S. Computer Science, Stanford University",
    experience_years: 6,
    profile_picture_url: null,
    interview_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    interview_status: "scheduled",
    hr_notes: "Strong technical background, excellent communication skills",
    communication_skills: 85,
    final_remarks: "Top candidate for the position",
    latestScore: 87,
    analysisStatus: "analyzed",
    matchedSkills: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"]
  },
  {
    id: "demo-2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 555-0456",
    applied_role: "Full Stack Developer",
    status: "pending" as const,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    education: "B.S. Computer Engineering, MIT",
    experience_years: 3,
    profile_picture_url: null,
    interview_date: null,
    interview_status: "not_scheduled",
    hr_notes: null,
    communication_skills: 0,
    final_remarks: null,
    latestScore: 72,
    analysisStatus: "analyzed",
    matchedSkills: ["JavaScript", "Python", "React", "MongoDB"]
  },
  {
    id: "demo-3",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    phone: "+1 555-0789",
    applied_role: "Data Analyst",
    status: "reviewed" as const,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    education: "B.A. Statistics, UCLA",
    experience_years: 2,
    profile_picture_url: null,
    interview_date: null,
    interview_status: "not_scheduled",
    hr_notes: "Good analytical skills, needs more SQL experience",
    communication_skills: 70,
    final_remarks: null,
    latestScore: 65,
    analysisStatus: "analyzed",
    matchedSkills: ["Python", "Excel", "Tableau", "R"]
  },
  {
    id: "demo-4",
    name: "James Wilson",
    email: "james.w@email.com",
    phone: "+1 555-0321",
    applied_role: "Senior Software Engineer",
    status: "selected" as const,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    education: "Ph.D. Computer Science, Carnegie Mellon",
    experience_years: 8,
    profile_picture_url: null,
    interview_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    interview_status: "selected",
    hr_notes: "Exceptional candidate, strong leadership potential",
    communication_skills: 95,
    final_remarks: "Offer extended",
    latestScore: 94,
    analysisStatus: "analyzed",
    matchedSkills: ["Java", "Kubernetes", "Microservices", "System Design", "AWS", "Docker"]
  },
  {
    id: "demo-5",
    name: "Lisa Park",
    email: "lisa.park@email.com",
    phone: "+1 555-0654",
    applied_role: "UI/UX Designer",
    status: "rejected" as const,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    education: "B.F.A. Graphic Design, RISD",
    experience_years: 4,
    profile_picture_url: null,
    interview_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    interview_status: "rejected",
    hr_notes: "Good portfolio but not aligned with company style",
    communication_skills: 60,
    final_remarks: "Not a fit for current opening",
    latestScore: 45,
    analysisStatus: "analyzed",
    matchedSkills: ["Figma", "Adobe XD"]
  },
  {
    id: "demo-6",
    name: "David Thompson",
    email: "david.t@email.com",
    phone: null,
    applied_role: "DevOps Engineer",
    status: "pending" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    education: "B.S. Information Technology",
    experience_years: 5,
    profile_picture_url: null,
    interview_date: null,
    interview_status: "not_scheduled",
    hr_notes: null,
    communication_skills: 0,
    final_remarks: null,
    latestScore: undefined,
    analysisStatus: "pending",
    matchedSkills: []
  }
];

export const mockResumes = [
  {
    id: "resume-1",
    candidate_id: "demo-1",
    version: 2,
    resume_name: "Sarah_Johnson_Resume_v2.pdf",
    resume_url: null,
    resume_text: "Experienced software engineer with 6+ years...",
    overall_score: 87,
    skills_match: 85,
    experience_score: 90,
    education_score: 88,
    ats_score: 82,
    formatting_score: 90,
    grammar_score: 95,
    matched_skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Git", "CI/CD"],
    missing_skills: ["Kubernetes", "GraphQL"],
    strengths: [
      "Strong technical expertise in modern web technologies",
      "Excellent problem-solving abilities demonstrated through projects",
      "Clear and well-structured resume format"
    ],
    weaknesses: [
      "Could highlight leadership experience more",
      "Missing quantifiable achievements in some roles"
    ],
    ai_suggestions: [
      "Add specific metrics to demonstrate impact (e.g., 'Improved load time by 40%')",
      "Include Kubernetes experience if any",
      "Consider adding a brief summary section at the top"
    ],
    job_description: "Looking for a Senior Software Engineer with React and Node.js experience...",
    analysis_status: "analyzed",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "resume-1-v1",
    candidate_id: "demo-1",
    version: 1,
    resume_name: "Sarah_Johnson_Resume.pdf",
    resume_url: null,
    resume_text: "Software engineer with experience...",
    overall_score: 75,
    skills_match: 70,
    experience_score: 80,
    education_score: 88,
    ats_score: 72,
    formatting_score: 75,
    grammar_score: 85,
    matched_skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    missing_skills: ["AWS", "Kubernetes", "GraphQL", "CI/CD"],
    strengths: ["Good technical skills", "Relevant education"],
    weaknesses: ["Resume too long", "Missing keywords"],
    ai_suggestions: ["Shorten resume to 2 pages", "Add more keywords"],
    job_description: "Looking for a Senior Software Engineer...",
    analysis_status: "analyzed",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "resume-2",
    candidate_id: "demo-2",
    version: 1,
    resume_name: "Michael_Chen_Resume.pdf",
    resume_url: null,
    resume_text: "Full stack developer passionate about building...",
    overall_score: 72,
    skills_match: 75,
    experience_score: 65,
    education_score: 85,
    ats_score: 70,
    formatting_score: 78,
    grammar_score: 80,
    matched_skills: ["JavaScript", "Python", "React", "MongoDB", "Express.js"],
    missing_skills: ["TypeScript", "AWS", "Docker"],
    strengths: [
      "Strong educational background from MIT",
      "Good variety of technical projects"
    ],
    weaknesses: [
      "Limited professional experience",
      "Missing cloud platform experience"
    ],
    ai_suggestions: [
      "Add TypeScript to your skillset",
      "Include any AWS or cloud experience",
      "Quantify project impacts with metrics"
    ],
    job_description: "Full Stack Developer position...",
    analysis_status: "analyzed",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "resume-4",
    candidate_id: "demo-4",
    version: 1,
    resume_name: "James_Wilson_Resume.pdf",
    resume_url: null,
    resume_text: "Senior software engineer and technical lead...",
    overall_score: 94,
    skills_match: 95,
    experience_score: 96,
    education_score: 98,
    ats_score: 92,
    formatting_score: 90,
    grammar_score: 95,
    matched_skills: ["Java", "Kubernetes", "Microservices", "System Design", "AWS", "Docker", "Leadership"],
    missing_skills: [],
    strengths: [
      "Exceptional technical depth and breadth",
      "Strong leadership and mentoring experience",
      "Ph.D. with published research",
      "Proven track record of delivering complex systems"
    ],
    weaknesses: [
      "Resume could be more concise"
    ],
    ai_suggestions: [
      "Consider a more concise format for senior roles",
      "Highlight recent achievements more prominently"
    ],
    job_description: "Senior Software Engineer...",
    analysis_status: "analyzed",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const mockNotes = [
  {
    id: "note-1",
    candidate_id: "demo-1",
    note_type: "interview",
    content: "First round interview went very well. Strong technical skills, solved the coding challenge efficiently. Recommended for final round.",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "note-2",
    candidate_id: "demo-1",
    note_type: "general",
    content: "Candidate has experience at Google and Microsoft. Strong references.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "note-3",
    candidate_id: "demo-4",
    note_type: "offer",
    content: "Offer accepted! Starting date: January 15th. Negotiated salary: $180k + equity.",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export type MockCandidate = typeof mockCandidates[0];
export type MockResume = typeof mockResumes[0];
export type MockNote = typeof mockNotes[0];
