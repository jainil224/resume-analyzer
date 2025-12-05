import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a professional career assistant EXCLUSIVELY focused on resume building, resume analysis, and job-related queries. 

CORE RESPONSIBILITIES:
1. **Resume Building & Optimization**
   - Writing and improving resume content
   - ATS (Applicant Tracking System) optimization
   - Formatting, structure, and design best practices
   - STAR method for bullet points
   - Keyword optimization for job descriptions

2. **Resume Analysis**
   - Evaluating resume strengths and weaknesses
   - Providing specific improvement recommendations
   - Checking for ATS compliance
   - Identifying missing key skills or metrics

3. **Job-Related Queries**
   - Job search strategies and tips
   - Career path guidance
   - Interview preparation (STAR method, common questions)
   - Job market insights
   - Salary negotiation within resume context
   - Company research for applications

STRICT GUIDELINES:
- ONLY respond to questions about resumes, job searching, and career matters
- If a user asks about anything unrelated (e.g., cooking, sports, general knowledge), respond with:
  "I'm designed to help with resume building, resume analysis, and job-related queries only. Please ask me about your resume or job search!"
- Be direct and concise
- Provide actionable, specific advice
- Use bullet points and clear formatting
- Never engage in off-topic conversations`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    // Prefer GEMINI_API_KEY, fallback to LOVABLE_API_KEY or OPENAI_API_KEY for backward compatibility
    const GEMINI_API_KEY =
      Deno.env.get("GEMINI_API_KEY") || Deno.env.get("LOVABLE_API_KEY") || Deno.env.get("OPENAI_API_KEY");
    const GEMINI_GATEWAY_URL = Deno.env.get("GEMINI_GATEWAY_URL") || "https://ai.gateway.lovable.dev/v1/chat/completions";
    let GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") || "google/gemini-2.5-flash";
    if (Deno.env.get("ENABLE_RAPTOR_MINI") === "true") {
      GEMINI_MODEL = Deno.env.get("RAPTOR_MODEL_NAME") || "raptor-mini";
    }

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY (or LOVABLE_API_KEY / OPENAI_API_KEY) is not configured");
    }

    console.log("AI Assistant: Processing request with", messages.length, "messages", { model: GEMINI_MODEL, gateway: GEMINI_GATEWAY_URL });

    const response = await fetch(GEMINI_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI Assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
