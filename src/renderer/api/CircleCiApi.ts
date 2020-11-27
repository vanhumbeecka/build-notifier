import { Actions } from '../../common/events'
import { AccountModule } from '../store'
import { Build, buildFromCircleCiData } from '../store/models/build'
import { Repository, repositoryFromCircleProjects } from '../store/models/repository'
import { BuildApi } from './BuildApi'
import { CircleProjectResponse } from '../../common/models/CircleProjectResponse'
import { CircleBuildResponse } from '../../common/models/CirlceBuildResponse'

/**
 * Because CircleCI does NOT allow sending API request through the browser (blocked by CORS),
 * We dispatch this request to the node process and return the result back here.
 */
export class CircleCiApi implements BuildApi {

  async requestBuildInfo(workspaceAndRepo: string): Promise<Build[]> {
    const response = Actions.requestBuildInfo<CircleBuildResponse[]>('circleci', AccountModule.circleCiToken, workspaceAndRepo)

    if (!response) {
      return Promise.reject(`Could not fetch build info from circleci`)
    }

    return buildFromCircleCiData(response)
  }

  async requestProjectInfo(search: string): Promise<Repository[]> {
    const response = Actions.requestProjectInfo<CircleProjectResponse>('circleci', AccountModule.circleCiToken)
    if (!response) {
      return Promise.reject(`Could not fetch project info from circleci`)
    }

    const repositories = repositoryFromCircleProjects(response);
    return repositories.filter(r => r.name.includes(search))
  }
}

export const circleCiApi = new CircleCiApi()
