import { Actions } from '../../common/events'
import { GithubBuildResponse } from '../../common/models/GithubBuildResponse'
import { GithubProjectResponse } from '../../common/models/GithubProjectResponse'
import { AccountModule } from '../store'
import { Build, buildFromGithubData } from '../store/models/build'
import { Repository, repositoryFromGithubProjects } from '../store/models/repository'
import { BuildApi } from './BuildApi'

export class GithubApi implements BuildApi {

  async requestBuildInfo(workspaceAndRepo: string): Promise<Build[]> {
    const response = Actions.requestBuildInfo<GithubBuildResponse>('github', AccountModule.githubAccessToken, workspaceAndRepo)

    if (!response) {
      return Promise.reject(`Could not fetch build info from github`)
    }

    return buildFromGithubData(response)
  }

  async requestProjectInfo(search: string): Promise<Repository[]> {
    const response = Actions.requestProjectInfo<GithubProjectResponse[]>('github', AccountModule.githubAccessToken)
    if (!response) {
      return Promise.reject(`Could not fetch project info from github`)
    }

    const repositories = repositoryFromGithubProjects(response);
    return repositories.filter(r => r.name.includes(search))
  }
}

export const githubApi = new GithubApi()
