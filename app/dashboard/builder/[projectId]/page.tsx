import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProjectById } from "@/lib/supabase/projects";
import { PROJECT_TYPE_LABELS } from "@/lib/types/project";
import ArchitectureView from "./architecture-view";

interface Props {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { projectId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const project = await getProjectById(projectId);
  if (!project || project.user_id !== user.id) notFound();

  return (
    <div className="min-h-screen bg-[#030305] text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard" className="text-[12px] text-white/25 hover:text-white/50 transition-colors">
            Dashboard
          </Link>
          <span className="text-white/15">/</span>
          <Link href="/dashboard/builder" className="text-[12px] text-white/25 hover:text-white/50 transition-colors">
            Builder
          </Link>
          <span className="text-white/15">/</span>
          <span className="text-[12px] text-white/45 truncate max-w-[200px]">{project.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{project.name}</h1>
            <p className="text-[13px] text-white/30 mt-1">
              {PROJECT_TYPE_LABELS[project.project_type]} ·{" "}
              {new Date(project.created_at).toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Architecture view (client component handles generation) */}
        <ArchitectureView project={project} />
      </div>
    </div>
  );
}
