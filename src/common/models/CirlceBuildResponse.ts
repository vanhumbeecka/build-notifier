export interface CircleBuildResponse {
  committer_date: null | string;
  body: null | string;
  usage_queued_at: Date;
  reponame: string;
  build_url: string;
  parallel: number;
  branch: null | string;
  username: string;
  author_date: Date | null;
  why: string;
  user: User;
  vcs_revision: string;
  workflows: Workflow | Workflow[];
  vcs_tag: null | string;
  pull_requests: any[] | null;
  build_num: number;
  committer_email: null;
  status: 'retried' | 'canceled' | 'infrastructure_fail' | 'timedout' | 'not_run' | 'running' | 'failed' | 'queued' | 'scheduled' | 'not_running' | 'no_tests' | 'fixed' | 'succes'
  committer_name: null;
  subject: null | string;
  dont_build: null;
  lifecycle: 'finished' | 'queued' | 'scheduled' | 'not_run' | 'not_running' | 'running';
  fleet: string;
  stop_time: Date;
  build_time_millis: number;
  start_time: Date;
  platform: string;
  outcome: 'canceled' | 'infrastructure_fail' | 'timedout' | 'failed' | 'no_tests' | 'success';
  vcs_url: string;
  author_name: null | string;
  queued_at: Date;
  author_email: null | string;
}

export interface User {
  is_user: boolean;
  login: string;
  avatar_url: string;
  name: string;
  vcs_type: string;
  id: string;
}


export interface Workflow {
  job_name: string;
  job_id: string;
  workflow_id: string;
  workspace_id: string;
  upstream_job_ids: any[];
  upstream_concurrency_map: any;
  workflow_name: string;
}
