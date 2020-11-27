import {Repository} from './repository'
import {Build} from './build'

export interface RepositoryBuilds {
  repository: Repository
  builds: Build[]
}

