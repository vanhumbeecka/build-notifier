import moment, { Moment } from 'moment'
import { AccountType } from '../../../common/models/AccountType'
import { CircleBuildResponse } from '../../../common/models/CirlceBuildResponse'
import { GithubBuildResponse } from '../../../common/models/GithubBuildResponse'
import {
  BitbucketPipelineResponse, RefType, ResultName, StageName, StateName
} from '../../api/models/BitbucketPipelineResponse'
import { recentLastSort } from '../../common/utils'

export type Outcome = 'FAILED' | 'SUCCESSFUL' | 'PAUSED' | 'ONGOING' | 'UNKNOWN'


export interface Build {
  duration: number
  expired: boolean
  id: string | number,
  hasStopped: boolean,
  outcome: Outcome,
  result: string
  createdOn: Moment
  href: string
  branchOrTagName: string
  refType: RefType,
  accountType: AccountType
}

export const buildFromCircleCiData = (response: CircleBuildResponse[]): Build[] => {
  if (!response || response.length === 0) {
    return []
  }

  const builds: Build[] = response.map(v => {

    let outcome: Outcome;
    if (v.outcome === 'success') {
      outcome = 'SUCCESSFUL'
    } else if (v.outcome === 'failed') {
      outcome = 'FAILED'
    } else if (v.outcome === 'canceled') {
      outcome = 'PAUSED'
    } else if (!v.outcome) {
      outcome = 'ONGOING'
    } else {
      outcome = 'UNKNOWN'
    }

    let refType: RefType;
    if (v.branch) {
      refType = RefType.Branch
    } else if (v.vcs_tag) {
      refType = RefType.Tag
    } else {
      refType = RefType.Branch
    }

    return {
      branchOrTagName: v.branch || v.vcs_tag || "",
      outcome: outcome,
      id: v.build_url,
      href: v.build_url,
      hasStopped: v.lifecycle === 'finished',
      expired: false,
      duration: v.build_time_millis / 1000,
      createdOn: moment(v.start_time),
      refType: refType,
      result: v.status,
      accountType: 'circleci'
    }
  })

  return builds.sort(recentLastSort)
}

export const buildFromBitbucketData = (response: BitbucketPipelineResponse): Build[] => {
  if (!response || !response.values) {
    return []
  }

  const builds: Build[] = response.values.map(v => {

    const bitBucketBuildUri = `https://bitbucket.org/${v.repository.full_name}/addon/pipelines/home#!/results/${v.build_number}`

    const hasStopped = v.state.name === StateName.Completed

    let outcome: Outcome
    if (hasStopped && v.state.result?.name === ResultName.Failed) {
      outcome = 'FAILED'
    } else if (hasStopped && v.state.result?.name === ResultName.Successful) {
      outcome = 'SUCCESSFUL'
    } else if (v.state.stage?.name === StageName.Paused) {
      outcome = 'PAUSED'
    } else {
      outcome = 'ONGOING'
    }


    let duration = v.duration_in_seconds
    if (outcome === 'ONGOING') {
      duration = moment().diff(moment(v.created_on), 'seconds')
    }

    return {
      duration: duration,
      expired: v.expired,
      id: v.build_number,
      hasStopped: hasStopped,
      outcome: outcome,
      result: v.state.result?.name || '',
      createdOn: moment(v.created_on),
      href: bitBucketBuildUri,
      branchOrTagName: v.target.ref_name,
      refType: v.target.ref_type,
      accountType: 'bitbucket-cloud'
    }
  })

  return builds.sort(recentLastSort)
}

export const buildFromGithubData = (response: GithubBuildResponse): Build[] => {
  if (!response || !response.workflow_runs) {
    return []
  }

  const builds: Build[] = response.workflow_runs.map(v => {

    let outcome: Outcome;
    if (v.conclusion === 'success') {
      outcome = 'SUCCESSFUL'
    } else if (v.conclusion === 'failure') {
      outcome = 'FAILED'
    } else if (v.conclusion === 'cancelled') {
      outcome = 'PAUSED'
    } else if (v.status === 'in_progress' || !v.conclusion) {
      outcome = 'ONGOING'
    } else {
      outcome = 'UNKNOWN'
    }

    let duration = moment(v.updated_at).diff(v.created_at, 'seconds')
    if (v.status === 'in_progress') {
      duration = moment().diff(moment(v.created_at), 'seconds')
    }

    const branchOrTagName = v.head_branch
    let refType = RefType.Branch
    if (/^v\d\.\d\.\d$/.test(branchOrTagName)) {
      refType = RefType.Tag
    }

    return {
      branchOrTagName: branchOrTagName,
      outcome: outcome,
      id: v.id,
      href: v.html_url,
      hasStopped: v.status === 'completed',
      expired: false,
      duration: duration,
      createdOn: moment(v.created_at),
      refType: refType,
      result: v.status,
      accountType: 'github'
    }
  })

  return builds.sort(recentLastSort)
}
