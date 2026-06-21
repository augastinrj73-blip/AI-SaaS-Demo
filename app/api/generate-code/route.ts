import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectById, saveGeneratedCode } from "@/lib/supabase/projects";

export const maxDuration = 60;

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

  // 4. Website-only gate
  if (project.project_type !== "website") {
    return NextResponse.json(
      { error: "Code generation is currently only available for Website projects" },
      { status: 400 }
    );
  }

  // 5. Architecture must exist
  if (!project.architecture) {
    return NextResponse.json(
      { error: "Generate an architecture plan first before generating code" },
      { status: 400 }
    );
  }

  const arch = project.architecture;
  const homePage = arch.pages.find((p) => p.path === "/" || p.path === "/home") ?? arch.pages[0];
  const sections = homePage?.components?.join(", ") ?? "navigation, hero, features, CTA, footer";

  const prompt = `You are an expert frontend web developer. Generate a complete, production-quality HTML landing page for the following product.

Product name: ${arch.appName}
Product summary: ${arch.summary}
Homepage description: ${homePage?.description ?? arch.summary}
Key sections to include: ${sections}
Original project prompt: ${project.prompt}

Requirements:
- Single HTML file with ALL styles inside a <style> tag and ALL interactivity inside a <script> tag
- No external CSS frameworks or JS libraries — only ONE Google Fonts @import is allowed inside the <style> tag
- Dark, modern, premium design with subtle gradients, glassmorphism cards, and smooth hover effects
- Fully responsive layout using CSS Grid and Flexbox (mobile, tablet, desktop)
- Smooth scroll-triggered fade-in animations using IntersectionObserver in vanilla JS
- Sections: sticky navigation with blur backdrop, hero with headline + subheadline + CTA button, features grid, social proof / stats row, final CTA section, footer
- Professional quality matching Stripe / Linear / Vercel — no clip-art, no rainbow gradients, no Comic Sans
- Return ONLY the raw HTML starting with <!DOCTYPE html> and ending with </html>
- No markdown fences, no explanation, no comments outside the HTML tags themselves`;

  // 6. Call Gemini
  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            // Disable thinking budget to get a clean single-part response
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      throw new Error(`Gemini API error ${geminiRes.status}: ${errText}`);
    }

    const geminiData = await geminiRes.json();

    // Find the non-thought text part (2.5-flash may include thought parts)
    const parts: Array<{ thought?: boolean; text?: string }> =
      geminiData.candidates?.[0]?.content?.parts ?? [];
    const textPart = parts.find((p) => !p.thought && p.text);
    const rawText: string = textPart?.text ?? "";

    // Strip any accidental markdown fences
    const html = rawText
      .replace(/^```(?:html)?\n?/m, "")
      .replace(/\n?```$/m, "")
      .trim();

    if (!html.startsWith("<!DOCTYPE") && !html.startsWith("<html")) {
      throw new Error("Gemini returned unexpected content instead of HTML");
    }

    // 7. Persist and return
    await saveGeneratedCode(projectId, html);
    return NextResponse.json({ code: html });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
