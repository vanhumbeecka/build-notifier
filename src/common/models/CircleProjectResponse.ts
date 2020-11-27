export type CircleProjectResponse = CircleProjectSingleResponse[]

export interface CircleProjectSingleResponse {
  branches:       Branches;
  oss:            boolean;
  reponame:       string;
  parallel:       number;
  username:       string;
  has_usable_key: boolean;
  vcs_type:       string;
  language:       string;
  vcs_url:        string;
  following:      boolean;
  default_branch: string;
}

export interface Branches {
  [branchName: string]: Branch;
}

export interface Branch {
  latest_workflows:           Workflows;
  pusher_logins:              string[];
  running_builds:             any[];
  recent_builds:              CcBuild[];
  last_non_success:           CcBuild;
  latest_completed_workflows: Workflows;
  last_success:               CcBuild;
  is_using_workflows:         boolean;
}

export interface CcBuild {
  outcome:         string;
  status:          string;
  build_num:       number;
  vcs_revision:    string;
  pushed_at:       Date;
  is_workflow_job: boolean;
  is_2_0_job:      boolean;
  added_at:        Date;
}

export interface Workflows {
  [workflowName: string]: Workflow;
}

export interface Workflow {
  status:     string;
  created_at: Date;
  id:         string;
}
