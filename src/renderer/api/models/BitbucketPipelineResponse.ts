export interface BitbucketPipelineResponse {
    page:    number;
    pagelen: number;
    values:  Value[];
    size:    number;
}

export interface Value {
    type:                ValueType;
    uuid:                string;
    repository:          Repository;
    state:               State;
    build_number:        number;
    creator:             Creator;
    created_on:          Date;
    target:              Target;
    trigger:             Trigger;
    run_number:          number;
    duration_in_seconds: number;
    build_seconds_used:  number;
    expired:             boolean;
    links:               ValueLinks;
    has_variables:       boolean;
    completed_on?:       Date;
}

export interface Creator {
    type:          string;
    uuid:          string;
    display_name?: string;
    links?:        CreatorLinks;
    nickname?:     string;
    account_id?:   string;
}

export interface CreatorLinks {
    self:   Link;
    html:   Link;
    avatar: Link;
}

export interface Link {
    href: string;
}

export interface ValueLinks {
    self:  Link;
    steps: Link;
}

export interface Repository {
    name:      string;
    type:      string;
    full_name: string;
    links:     CreatorLinks;
    uuid:      string;
}


export interface State {
    name:    StateName;
    type:    string;
    stage?:  Stage;
    result?: Result;
}

export interface Result {
    name: ResultName;
    type: string;
}

export enum StateName {
    Completed = "COMPLETED",
    InProgress = "IN_PROGRESS",
}

export interface Trigger {
    name: TriggerName;
    type: string;
}

export enum TriggerName {
    Push = "PUSH"
}

export interface Stage {
    name: StageName;
    type: string;
}

export enum StageName {
    Paused = "PAUSED"
}

export enum ResultName {
    Failed = "FAILED",
    Successful = "SUCCESSFUL",
}

export interface Target {
    type:     TargetType;
    ref_type: RefType;
    ref_name: string;
    selector: Selector;
    commit:   Commit;
}

export interface Commit {
    type:  CommitType;
    hash:  string;
    links: CommitLinks;
}

export interface CommitLinks {
    self: Link;
    html: Link;
}

export enum CommitType {
    Commit = "commit",
}

export enum RefType {
    Branch = "branch",
    Tag = "tag",
}

export interface Selector {
    type:    SelectorType;
    pattern: string;
}

export enum SelectorType {
    Branches = "branches",
    Tags = "tags",
}

export enum TargetType {
    PipelineRefTarget = "pipeline_ref_target",
}

export enum ValueType {
    Pipeline = "pipeline",
}
