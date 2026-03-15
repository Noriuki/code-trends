// GitHub API types
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export interface GitHubSearchResponse {
  total_count: number;
  items: GitHubRepo[];
}

// npm API types
export interface NpmPackageInfo {
  name: string;
  description?: string;
  "dist-tags"?: { latest: string };
  versions?: Record<string, { version: string }>;
  repository?: { url: string; type: string };
  homepage?: string;
  license?: string;
  keywords?: string[];
}

export interface NpmDownloadPoint {
  downloads: number;
  package: string;
  start: string;
  end: string;
}

export interface NpmPackageWithStats {
  name: string;
  description: string;
  version: string;
  weeklyDownloads: number;
  repository?: string;
  homepage?: string;
  license?: string;
}

// Ecosystem activity (aggregated for dashboard)
export interface EcosystemHighlight {
  id: string;
  title: string;
  description: string;
  type: "github" | "npm" | "ecosystem";
  metric: string;
  timestamp: string;
}
