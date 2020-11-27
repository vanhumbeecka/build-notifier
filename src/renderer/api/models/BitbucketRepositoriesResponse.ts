export interface BitbucketRepositoryResponse {
  pagelen: number;
  values:  Value[];
  next:    string;
}

export interface Value {
  scm:         SCM;
  website:     null | string;
  has_wiki:    boolean;
  uuid:        string;
  links:       ValueLinks;
  fork_policy: ForkPolicy;
  full_name:   string;
  name:        string;
  project:     Project;
  language:    Language;
  created_on:  Date;
  mainbranch:  Mainbranch;
  workspace:   Project;
  has_issues:  boolean;
  owner:       Owner;
  updated_on:  Date;
  size:        number;
  type:        ValueType;
  slug:        string;
  is_private:  boolean;
  description: string;
}

export enum ForkPolicy {
  AllowForks = "allow_forks",
  NoPublicForks = "no_public_forks",
}

export enum Language {
  Empty = "",
  Javascript = "javascript",
}

export interface ValueLinks {
  watchers:     Avatar;
  branches:     Avatar;
  tags:         Avatar;
  commits:      Avatar;
  clone:        Clone[];
  self:         Avatar;
  source:       Avatar;
  html:         Avatar;
  avatar:       Avatar;
  hooks:        Avatar;
  forks:        Avatar;
  downloads:    Avatar;
  issues?:      Avatar;
  pullrequests: Avatar;
}

export interface Avatar {
  href: string;
}

export interface Clone {
  href: string;
  name: CloneName;
}

export enum CloneName {
  HTTPS = "https",
  SSH = "ssh",
}

export interface Mainbranch {
  type: string;
  name: string;
}

export interface Owner {
  username:     string;
  display_name: string;
  type:         string;
  uuid:         string;
  links:        OwnerLinks;
}

export interface OwnerLinks {
  self:   Avatar;
  html:   Avatar;
  avatar: Avatar;
}

export interface Project {
  links: OwnerLinks;
  type:  ProjectType;
  name:  string;
  key?:  Key;
  uuid:  string;
  slug?: string;
}

export enum Key {
  Obs = "OBS",
  Proj = "PROJ",
}

export enum ProjectType {
  Project = "project",
  Workspace = "workspace",
}

export enum SCM {
  Git = "git",
}

export enum ValueType {
  Repository = "repository",
}
