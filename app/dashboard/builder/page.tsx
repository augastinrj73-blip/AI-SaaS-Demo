import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserProjects } from "@/lib/supabase/projects";
import { PROJECT_TYPE_LABELS } from "@/lib/types/project";
import type { Project, ProjectStatus } from "@/lib/types/project";
import NewProjectForm from "./new-project-form";

function StatusBadge({ status }: { status: ProjectStatus }) {
  const map: Record<ProjectStatus, { label: string; cls: string }> = {
    draft:      { label: "Draft",      cls: "bg-white/[0.05] text-white/35 border-white/[0.08]"       },
    generating: { label: "Generating", cls: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"   },
    ready:      { label: "Ready",      cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    failed:     { label: "Failed",     cls: "bg-red-500/10 text-red-400 border-red-500/20"             },
  };
  const { label, cls } = map[status];
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const date = new Date(project.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <Link
      href={`/dashboard/builder/${project.id}`}
      className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group"
    >
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-white/80 group-hover:text-white transition-colors truncate">
          {project.name}
        </p>
        <p className="text-[12px] text-white/25 mt-0.5 truncate">{project.prompt}</p>
      </div>
      <span className="text-[12px] text-white/25 whitespace-nowrap hidden sm:block">
        {PROJECT_TYPE_LABELS[project.project_type]}
      </span>
      <StatusBadge status={project.status} />
      <span className="text-[11px] text-white/20 whitespace-nowrap hidden md:block">{date}</span>
      <svg
        className="w-4 h-4 text-white/15 group-hover:text-white/40 transition-colors shrink-0"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export default async function BuilderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const projects = await getUserProjects(user.id);

  return (
    <div className="min-h-screen bg-[#030305] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/dashboard"
              className="text-[12px] text-white/25 hover:text-white/50 transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-white/15">/</span>
            <span className="text-[12px] text-white/45">Builder</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Project Builder</h1>
          <p className="text-[14px] text-white/35 mt-1">
            Describe your idea and get an AI-generated architecture plan in seconds.
          </p>
        </div>

        {/* New project form */}
        <div className="glass border border-white/[0.07] rounded-2xl p-6 mb-8">
          <h2 className="text-[15px] font-semibold text-white mb-5">New project</h2>
          <NewProjectForm />
        </div>

        {/* Existing projects */}
        {projects.length > 0 && (
          <div className="glass border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.04]">
              <h2 className="text-[15px] font-semibold text-white">
                Your projects
                <span className="ml-2 text-[12px] font-normal text-white/25">
                  {projects.length}
                </span>
              </h2>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {projects.map((p) => (
                <ProjectRow key={p.id} project={p} />
              ))}
            </div>
          </div>
        )}

        {projects.length === 0 && (
          <div className="text-center py-12 text-white/20 text-[13px]">
            No projects yet — create your first one above.
          </div>
        )}
      </div>
    </div>
  );
}
