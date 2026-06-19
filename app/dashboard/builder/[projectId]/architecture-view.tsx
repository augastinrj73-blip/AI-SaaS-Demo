"use client";

import { useEffect, useState, useCallback } from "react";
import type { Project, ProjectArchitecture } from "@/lib/types/project";

const COMPLEXITY_COLOR: Record<string, string> = {
  "Low":       "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "Medium":    "text-amber-400 bg-amber-500/10 border-amber-500/20",
  "High":      "text-orange-400 bg-orange-500/10 border-orange-500/20",
  "Very High": "text-red-400 bg-red-500/10 border-red-500/20",
};

const METHOD_COLOR: Record<string, string> = {
  GET:    "text-emerald-400 bg-emerald-500/10",
  POST:   "text-indigo-400 bg-indigo-500/10",
  PUT:    "text-amber-400 bg-amber-500/10",
  PATCH:  "text-cyan-400 bg-cyan-500/10",
  DELETE: "text-red-400 bg-red-500/10",
};

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold text-white/25 uppercase tracking-[0.12em] mb-3">
      {children}
    </h3>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass border border-white/[0.07] rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  );
}

function ArchitecturePlan({ arch }: { arch: ProjectArchitecture }) {
  return (
    <div className="space-y-6">
      {/* Summary + Complexity */}
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-bold text-white mb-2">{arch.appName}</h2>
            <p className="text-[14px] text-white/45 leading-relaxed">{arch.summary}</p>
          </div>
          {arch.estimatedComplexity && (
            <span className={`shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full border ${
              COMPLEXITY_COLOR[arch.estimatedComplexity] ?? "text-white/40 bg-white/5 border-white/10"
            }`}>
              {arch.estimatedComplexity} complexity
            </span>
          )}
        </div>
      </Card>

      {/* Tech Stack */}
      <Card>
        <SectionHeader>Tech Stack</SectionHeader>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(arch.techStack).map(([category, items]) => (
            <div key={category}>
              <p className="text-[11px] text-white/30 font-medium capitalize mb-2">{category}</p>
              <div className="flex flex-wrap gap-1.5">
                {(items as string[]).map((item) => (
                  <span
                    key={item}
                    className="text-[12px] px-2.5 py-1 rounded-lg glass border border-white/[0.07] text-white/60"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Pages */}
      <Card>
        <SectionHeader>Pages / Screens ({arch.pages.length})</SectionHeader>
        <div className="space-y-3">
          {arch.pages.map((page) => (
            <div key={page.path} className="flex items-start gap-3 py-3 border-b border-white/[0.04] last:border-0">
              <code className="shrink-0 text-[12px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-mono">
                {page.path}
              </code>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-white/75">{page.name}</p>
                <p className="text-[12px] text-white/35 mt-0.5">{page.description}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {page.components.map((c) => (
                    <span key={c} className="text-[10px] text-white/25 bg-white/[0.03] border border-white/[0.05] px-1.5 py-0.5 rounded">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Database */}
      <Card>
        <SectionHeader>Database Schema ({arch.database.tables.length} tables)</SectionHeader>
        <div className="space-y-5">
          {arch.database.tables.map((table) => (
            <div key={table.name}>
              <div className="flex items-center gap-2 mb-2">
                <code className="text-[13px] font-bold text-white/80 font-mono">{table.name}</code>
                <span className="text-[11px] text-white/25">{table.description}</span>
              </div>
              <div className="rounded-xl border border-white/[0.06] overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                      <th className="px-3 py-2 text-[10px] font-semibold text-white/25 uppercase tracking-wider">Column</th>
                      <th className="px-3 py-2 text-[10px] font-semibold text-white/25 uppercase tracking-wider">Type</th>
                      <th className="px-3 py-2 text-[10px] font-semibold text-white/25 uppercase tracking-wider hidden sm:table-cell">Nullable</th>
                      <th className="px-3 py-2 text-[10px] font-semibold text-white/25 uppercase tracking-wider hidden md:table-cell">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {table.columns.map((col) => (
                      <tr key={col.name} className="hover:bg-white/[0.015] transition-colors">
                        <td className="px-3 py-2 font-mono text-[12px] text-white/70">{col.name}</td>
                        <td className="px-3 py-2 font-mono text-[12px] text-violet-400">{col.type}</td>
                        <td className="px-3 py-2 text-[11px] text-white/30 hidden sm:table-cell">
                          {col.nullable ? "YES" : "NO"}
                        </td>
                        <td className="px-3 py-2 text-[11px] text-white/30 hidden md:table-cell">{col.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* API Endpoints */}
      <Card>
        <SectionHeader>API Endpoints ({arch.apis.length})</SectionHeader>
        <div className="space-y-2">
          {arch.apis.map((api, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
              <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                METHOD_COLOR[api.method] ?? "text-white/40 bg-white/5"
              }`}>
                {api.method}
              </span>
              <code className="text-[12px] text-white/65 font-mono shrink-0">{api.path}</code>
              <span className="text-[12px] text-white/30 flex-1 min-w-0 truncate">{api.description}</span>
              {api.auth && (
                <span className="shrink-0 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                  auth
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Auth Strategy */}
      <Card>
        <SectionHeader>Auth Strategy</SectionHeader>
        <p className="text-[14px] font-medium text-white/75 mb-1">{arch.authStrategy.method}</p>
        <p className="text-[13px] text-white/35 mb-3">{arch.authStrategy.description}</p>
        <div className="flex flex-wrap gap-2">
          {arch.authStrategy.providers.map((p) => (
            <span key={p} className="text-[12px] px-2.5 py-1 rounded-lg glass border border-indigo-500/20 text-indigo-400">
              {p}
            </span>
          ))}
        </div>
      </Card>

      {/* Next Steps */}
      <Card>
        <SectionHeader>Suggested Next Steps</SectionHeader>
        <ol className="space-y-2.5">
          {arch.suggestedNextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-[11px] font-bold text-indigo-400">
                {i + 1}
              </span>
              <span className="text-[13px] text-white/55 leading-relaxed pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

export default function ArchitectureView({ project: initialProject }: { project: Project }) {
  const [project, setProject] = useState(initialProject);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-architecture", {
        method:  "POST",
        headers: { "content-type": "application/json" },
        body:    JSON.stringify({ projectId: project.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setProject((p) => ({ ...p, status: "ready", architecture: data.architecture }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setProject((p) => ({ ...p, status: "failed" }));
    } finally {
      setLoading(false);
    }
  }, [project.id]);

  // Auto-start if still in draft state on mount
  useEffect(() => {
    if (project.status === "draft") generate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading || project.status === "generating") {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <p className="text-[15px] font-semibold text-white">Generating architecture plan…</p>
          <p className="text-[13px] text-white/30 mt-1">Claude is designing your tech stack, schema, and API — this takes ~15 seconds.</p>
        </div>
      </div>
    );
  }

  // ── Error / Failed ────────────────────────────────────────────────────────
  if (project.status === "failed" || error) {
    return (
      <div className="glass border border-red-500/20 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-[15px] font-semibold text-white mb-1">Generation failed</p>
        <p className="text-[13px] text-white/35 mb-5 max-w-md mx-auto">
          {error ?? project.error_message ?? "An unexpected error occurred."}
        </p>
        <button
          onClick={generate}
          className="btn-primary px-6 py-2.5 rounded-xl text-[13px] font-semibold"
        >
          Retry generation
        </button>
      </div>
    );
  }

  // ── Ready ─────────────────────────────────────────────────────────────────
  if (project.status === "ready" && project.architecture) {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <button
            onClick={generate}
            className="btn-ghost px-4 py-2 rounded-xl text-[13px] flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Regenerate plan
          </button>
        </div>
        <ArchitecturePlan arch={project.architecture} />
      </div>
    );
  }

  return null;
}
