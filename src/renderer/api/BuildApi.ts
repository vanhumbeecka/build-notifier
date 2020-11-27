import {Build} from '../store/models/build'
import { Repository } from '../store/models/repository'

export interface BuildApi {
  requestBuildInfo(workspaceAndRepoSlug: string): Promise<Build[]>
  requestProjectInfo(search: string): Promise<Repository[]>
}
