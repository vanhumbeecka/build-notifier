import moment from "moment";
import { AccountType } from '../../../common/models/AccountType'
import { GithubProjectResponse } from '../../../common/models/GithubProjectResponse'
import {BitbucketRepositoryResponse} from '../../api/models/BitbucketRepositoriesResponse'
import { CircleProjectResponse } from '../../../common/models/CircleProjectResponse'

export interface Repository {
  id: string
  name: string;
  fullname: string;
  href: URL;
  lastModified: moment.Moment
  selected: boolean
  currentFilter: boolean,
  accountType: AccountType
}

export const repositoryFromCircleProjects = (response: CircleProjectResponse): Repository[] => {
  if (!response || response.length === 0) {
    return []
  }

  return response.map(v => {

    const brancheNames = Object.keys(v.branches)

    const buildMoments: moment.Moment[] = []
    brancheNames.forEach(branch => {
      const recentBuilds = v.branches[branch].recent_builds
      buildMoments.push(...recentBuilds.map(b => moment(b.added_at)))
    })

    let mostRecentBuild: moment.Moment | undefined;
    buildMoments.forEach(b => {
      if (!mostRecentBuild) {
        mostRecentBuild = b
      } else if (b.isAfter(mostRecentBuild)) {
        mostRecentBuild = b;
      }
    })

    if (!mostRecentBuild) {
      mostRecentBuild = moment()
    }

    return {
      id: v.vcs_url,
      name: v.reponame,
      fullname: `${v.vcs_type}/${v.username}/${v.reponame}`,
      href: new URL(v.vcs_url),
      lastModified: mostRecentBuild,
      selected: false,
      currentFilter: false,
      accountType: 'circleci'
    }
  })
}

export const repositoryFromBitbucketProjects = (response: BitbucketRepositoryResponse): Repository[] => {
  if (!response || !response.values) {
    return []
  }

  return response.values.map(v => ({
    id: v.uuid,
    name: v.name,
    fullname: v.full_name,
    href: new URL(v.links.source.href),
    lastModified: moment(v.updated_on),
    selected: false,
    currentFilter: false,
    accountType: 'bitbucket-cloud'
  }));
}

export const repositoryFromGithubProjects = (response: GithubProjectResponse[]): Repository[] => {
  if (!response || response.length === 0) {
    return []
  }

  return response.map(p => ({
    id: p.id.toString(),
    name: p.name,
    fullname: p.full_name,
    href: new URL(p.html_url),
    lastModified: moment(p.updated_at),
    selected: false,
    currentFilter: false,
    accountType: 'github'
  }))
}
