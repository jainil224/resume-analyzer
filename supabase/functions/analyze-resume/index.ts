import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return new Response(
        JSON.stringify({ error: "Resume text and job description are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prefer GEMINI_API_KEY, fallback to LOVABLE_API_KEY or OPENAI_API_KEY for backward compatibility
    const GEMINI_API_KEY =
      Deno.env.get("GEMINI_API_KEY") || Deno.env.get("LOVABLE_API_KEY") || Deno.env.get("OPENAI_API_KEY");
    const GEMINI_GATEWAY_URL = Deno.env.get("GEMINI_GATEWAY_URL") || "https://ai.gateway.lovable.dev/v1/chat/completions";
    let GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") || "google/gemini-2.5-flash";
    if (Deno.env.get("ENABLE_RAPTOR_MINI") === "true") {
      GEMINI_MODEL = Deno.env.get("RAPTOR_MODEL_NAME") || "raptor-mini";
    }

    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY (or LOVABLE_API_KEY / OPENAI_API_KEY) is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an expert AI Resume Analyzer. Analyze the provided resume against the job description and return a detailed JSON analysis.

Your response MUST be valid JSON with this exact structure:
{
  "overall_score": <number 0-100>,
  "skills_match": <number 0-40>,
  "experience_score": <number 0-30>,
  "ats_score": <number 0-20>,
  "formatting_score": <number 0-10>,
  "matched_skills": ["skill1", "skill2", ...],
  "missing_skills": ["skill1", "skill2", ...],
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "ai_suggestions": ["suggestion1", "suggestion2", ...]
}

Scoring Guidelines:
- skills_match (0-40): How well resume skills match job requirements
- experience_score (0-30): Relevance and depth of experience
- ats_score (0-20): How well formatted for ATS systems
- formatting_score (0-10): Overall resume structure and readability
- overall_score: Sum of all scores

Provide:
- 5-10 matched skills found in both resume and job
- 3-7 missing skills required by job but not in resume
- 3-5 specific strengths of the resume
- 3-5 areas for improvement
- 5-7 actionable AI suggestions to improve the resume

Be thorough, specific, and actionable in your analysis.`;

    const userPrompt = `RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Analyze this resume against the job description and provide the JSON analysis.`;

    console.log("Calling AI Gateway for resume analysis", { model: GEMINI_MODEL, gateway: GEMINI_GATEWAY_URL });

    const response = await fetch(GEMINI_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "Invalid AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse JSON from response (handle markdown code blocks)
    let analysisJson = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      analysisJson = jsonMatch[1].trim();
    }

    try {
      const analysis = JSON.parse(analysisJson);
      console.log("Analysis completed successfully");

      return new Response(
        JSON.stringify(analysis),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.error("Raw content:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI analysis" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("analyze-resume error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
