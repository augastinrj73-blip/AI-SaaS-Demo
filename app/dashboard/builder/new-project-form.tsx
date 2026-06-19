"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  PROJECT_TYPE_LABELS,
  PROJECT_TYPE_ICONS,
  PROJECT_TYPE_DESCRIPTIONS,
} from "@/lib/types/project";
import type { ProjectType } from "@/lib/types/project";

const TYPES = Object.keys(PROJECT_TYPE_LABELS) as ProjectType[];

export default function NewProjectForm() {
  const router = useRouter();
  const [name, setName]           = useState("");
  const [prompt, setPrompt]       = useState("");
  const [type, setType]           = useState<ProjectType>("webapp");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) { setError("Please describe your project."); return; }
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const projectName = name.trim() || `${PROJECT_TYPE_LABELS[type]} — ${new Date().toLocaleDateString()}`;

      const { data, error: insertError } = await supabase
        .from("projects")
        .insert({
          user_id:      user.id,
          name:         projectName,
          prompt:       prompt.trim(),
          project_type: type,
          status:       "draft",
        })
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);
      router.push(`/dashboard/builder/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Project name (optional) */}
      <div>
        <label
          htmlFor="project-name"
          className="block text-[11px] font-medium text-white/35 uppercase tracking-wider mb-1.5"
        >
          Project name <span className="text-white/20">(optional)</span>
        </label>
        <input
          id="project-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My awesome app"
          className="input-dark w-full"
          suppressHydrationWarning
        />
      </div>

      {/* Prompt */}
      <div>
        <label
          htmlFor="project-prompt"
          className="block text-[11px] font-medium text-white/35 uppercase tracking-wider mb-1.5"
        >
          Describe your project <span className="text-red-400">*</span>
        </label>
        <textarea
          id="project-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. A multi-tenant SaaS platform for restaurant inventory management with real-time alerts, supplier integrations, and analytics dashboards for chain owners."
          rows={4}
          className="input-dark w-full resize-none"
          suppressHydrationWarning
        />
        <p className="text-[11px] text-white/20 mt-1">
          Be specific — mention target users, core features, and any technical constraints.
        </p>
      </div>

      {/* Project type cards */}
      <div>
        <p className="text-[11px] font-medium text-white/35 uppercase tracking-wider mb-2.5">
          Project type
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {TYPES.map((t) => {
            const active = type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all duration-150 ${
                  active
                    ? "bg-indigo-500/10 border-indigo-500/35 text-indigo-400"
                    : "glass border-white/[0.07] text-white/35 hover:text-white/60 hover:border-white/[0.14]"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={PROJECT_TYPE_ICONS[t]} />
                </svg>
                <span className="text-[12px] font-medium leading-tight">
                  {PROJECT_TYPE_LABELS[t]}
                </span>
                <span className="text-[10px] leading-tight opacity-60 hidden sm:block">
                  {PROJECT_TYPE_DESCRIPTIONS[t]}
                </span>
                {active && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-[13px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !prompt.trim()}
        className="btn-primary w-full py-3 rounded-xl text-[14px] font-semibold
                   flex items-center justify-center gap-2
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Creating project…
          </>
        ) : (
          <>
            Generate architecture plan
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
