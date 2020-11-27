export interface GithubBuildResponse {
  total_count:   number;
  workflow_runs: WorkflowRun[];
}

export interface WorkflowRun {
  id:              number;
  node_id:         string;
  head_branch:     string;
  head_sha:        string;
  run_number:      number;
  event:           "push" | string;
  status:          "completed" | "queued" | "active" | string;
  conclusion:      "success" | string | null;
  workflow_id:     number;
  url:             string;
  html_url:        string;
  pull_requests:   any[];
  created_at:      Date;
  updated_at:      Date;
  jobs_url:        string;
  logs_url:        string;
  check_suite_url: string;
  artifacts_url:   string;
  cancel_url:      string;
  rerun_url:       string;
  workflow_url:    string;
  head_commit:     HeadCommit;
  repository:      Repository;
  head_repository: Repository;
}

export interface HeadCommit {
  id:        string;
  tree_id:   string;
  message:   string;
  timestamp: Date;
  author:    Author;
  committer: Author;
}

export interface Author {
  name:  string;
  email: string;
}

export interface Repository {
  id:                number;
  node_id:           string;
  name:              string;
  full_name:         string;
  private:           boolean;
  owner:             Owner;
  html_url:          string;
  description:       string;
  fork:              boolean;
  url:               string;
  forks_url:         string;
  keys_url:          string;
  collaborators_url: string;
  teams_url:         string;
  hooks_url:         string;
  issue_events_url:  string;
  events_url:        string;
  assignees_url:     string;
  branches_url:      string;
  tags_url:          string;
  blobs_url:         string;
  git_tags_url:      string;
  git_refs_url:      string;
  trees_url:         string;
  statuses_url:      string;
  languages_url:     string;
  stargazers_url:    string;
  contributors_url:  string;
  subscribers_url:   string;
  subscription_url:  string;
  commits_url:       string;
  git_commits_url:   string;
  comments_url:      string;
  issue_comment_url: string;
  contents_url:      string;
  compare_url:       string;
  merges_url:        string;
  archive_url:       string;
  downloads_url:     string;
  issues_url:        string;
  pulls_url:         string;
  milestones_url:    string;
  notifications_url: string;
  labels_url:        string;
  releases_url:      string;
  deployments_url:   string;
}

export interface Owner {
  login:               string;
  id:                  number;
  node_id:             string;
  avatar_url:          string;
  gravatar_id:         string;
  url:                 string;
  html_url:            string;
  followers_url:       string;
  following_url:       string;
  gists_url:           string;
  starred_url:         string;
  subscriptions_url:   string;
  organizations_url:   string;
  repos_url:           string;
  events_url:          string;
  received_events_url: string;
  type:                string;
  site_admin:          boolean;
}
