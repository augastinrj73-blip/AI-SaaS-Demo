export type ProjectType =
  | "website"
  | "webapp"
  | "mobile"
  | "saas"
  | "software";

export type ProjectStatus = "draft" | "generating" | "ready" | "failed";

export interface ProjectArchitecture {
  appName: string;
  summary: string;
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    infrastructure: string[];
    thirdParty: string[];
  };
  pages: Array<{
    name: string;
    path: string;
    description: string;
    components: string[];
  }>;
  database: {
    tables: Array<{
      name: string;
      description: string;
      columns: Array<{
        name: string;
        type: string;
        nullable: boolean;
        description: string;
      }>;
    }>;
  };
  apis: Array<{
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    description: string;
    auth: boolean;
  }>;
  authStrategy: {
    method: string;
    providers: string[];
    description: string;
  };
  estimatedComplexity: "Low" | "Medium" | "High" | "Very High";
  suggestedNextSteps: string[];
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  prompt: string;
  project_type: ProjectType;
  status: ProjectStatus;
  architecture: ProjectArchitecture | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  website:  "Website",
  webapp:   "Web App",
  mobile:   "Mobile App",
  saas:     "SaaS Platform",
  software: "Software",
};

export const PROJECT_TYPE_ICONS: Record<ProjectType, string> = {
  website:  "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
  webapp:   "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  mobile:   "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
  saas:     "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
  software: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
};

export const PROJECT_TYPE_DESCRIPTIONS: Record<ProjectType, string> = {
  website:  "Marketing site, blog, or portfolio",
  webapp:   "Interactive browser-based application",
  mobile:   "iOS and/or Android application",
  saas:     "Multi-tenant cloud software product",
  software: "CLI tool, library, or desktop app",
};
