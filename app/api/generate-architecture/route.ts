import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectById, updateProjectStatus } from "@/lib/supabase/projects";
import type { ProjectArchitecture } from "@/lib/types/project";
import { PROJECT_TYPE_LABELS } from "@/lib/types/project";

// Allow up to 60s for the Gemini call
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are a senior software architect. Given a project description and type, produce a comprehensive architecture plan.

Return ONLY valid JSON — no markdown, no code fences, no commentary before or after — that exactly matches this TypeScript interface:

{
  "appName": string,
  "summary": string,
  "techStack": {
    "frontend": string[],
    "backend": string[],
    "database": string[],
    "infrastructure": string[],
    "thirdParty": string[]
  },
  "pages": [{ "name": string, "path": string, "description": string, "components": string[] }],
  "database": {
    "tables": [{
      "name": string,
      "description": string,
      "columns": [{ "name": string, "type": string, "nullable": boolean, "description": string }]
    }]
  },
  "apis": [{ "method": "GET"|"POST"|"PUT"|"PATCH"|"DELETE", "path": string, "description": string, "auth": boolean }],
  "authStrategy": { "method": string, "providers": string[], "description": string },
  "estimatedComplexity": "Low"|"Medium"|"High"|"Very High",
  "suggestedNextSteps": string[]
}

Rules:
- appName: a concise product name derived from the prompt
- summary: 2-3 sentences describing the product
- techStack: real, specific technology choices appropriate for the project type and scale
- pages: 4-8 key pages/screens with realistic component breakdowns
- database.tables: 3-6 tables with realistic columns (include id, created_at, etc.)
- apis: 6-12 REST endpoints covering core CRUD operations
- suggestedNextSteps: 5-7 concrete, ordered action items to start building
- Return valid JSON only — any other text will cause a parsing error`;

export async function POST(request: NextRequest) {
  // 1. Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse body
  let projectId: string;
  try {
    const body = await request.json();
    projectId = body.projectId;
    if (!projectId) throw new Error("missing projectId");
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // 3. Fetch project — verify ownership via RLS
  const project = await getProjectById(projectId);
  if (!project || project.user_id !== user.id) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // 4. Mark as generating
  await updateProjectStatus(projectId, "generating");

  // 5. Call Gemini
  try {
    const userPrompt = `Project type: ${PROJECT_TYPE_LABELS[project.project_type]}\n\nProject description:\n${project.prompt}`;
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }] },
          ],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      throw new Error(`Gemini API error ${geminiRes.status}: ${errText}`);
    }

    const geminiData = await geminiRes.json();
    const rawText: string = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // 6. Parse JSON from response — strip any accidental fences
    const jsonText = rawText
      .replace(/^```(?:json)?\n?/m, "")
      .replace(/\n?```$/m, "")
      .trim();

    const architecture: ProjectArchitecture = JSON.parse(jsonText);

    // 7. Save and return
    await updateProjectStatus(projectId, "ready", { architecture });
    return NextResponse.json({ architecture });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await updateProjectStatus(projectId, "failed", { errorMessage: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
