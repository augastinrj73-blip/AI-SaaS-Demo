import { createClient } from "@/lib/supabase/server";
import type { Project, ProjectStatus, ProjectArchitecture } from "@/lib/types/project";

export async function createProject(params: {
  userId: string;
  name: string;
  prompt: string;
  projectType: Project["project_type"];
}): Promise<Project> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id:      params.userId,
      name:         params.name,
      prompt:       params.prompt,
      project_type: params.projectType,
      status:       "draft",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Project;
}

export async function getUserProjects(userId: string): Promise<Project[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Project[];
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Project;
}

export async function updateProjectStatus(
  id: string,
  status: ProjectStatus,
  opts?: { architecture?: ProjectArchitecture; errorMessage?: string }
): Promise<void> {
  const supabase = await createClient();

  const patch: Record<string, unknown> = { status };
  if (opts?.architecture)  patch.architecture  = opts.architecture;
  if (opts?.errorMessage)  patch.error_message = opts.errorMessage;

  const { error } = await supabase
    .from("projects")
    .update(patch)
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
