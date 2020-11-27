import {Repository} from '../renderer/store/models/repository'
import {Build, Outcome} from '../renderer/store/models/build'
import log from 'electron-log'
import { bitbucketService, circleCiService, githubService } from './AuthServices'
import { BaseApiTokenService } from './BaseApiTokenService'
import { BaseAuthService } from './BaseAuthService'
import { BaseOAuthAuthService } from './BaseOAuthAuthService'
import { BaseOAuthNoRefreshAuthService } from './BaseOAuthNoRefreshAuthService'
import { AccountType } from './models/AccountType'

export const sortProjectFunction = (a: Repository, b: Repository): number => {
  if (a.lastModified.isAfter(b.lastModified)) {
    return 1
  } else if (a.lastModified.isSame(b.lastModified)) {
    return 0
  } else {
    return -1
  }
}

export const sortBuildFunction = (a: Build, b: Build): number => {
  if (a.createdOn.isAfter(b.createdOn)) {
    return 1;
  } else if (a.createdOn.isSame(b.createdOn)) {
    return 0;
  } else {
    return -1;
  }
}

export const fetchOutcomeOfMostRecentBuild = (builds: Build[]): Outcome => {
  if (!builds || builds.length === 0) {
    return "UNKNOWN"
  }
  return builds.sort(sortBuildFunction)[builds.length - 1].outcome
}

export const logEvent = (input: string, extra?: string): void => {
  log.debug(`Event Received: [${input}] ${extra}`)
}

export const getAuthService = (accountType: AccountType): BaseOAuthAuthService | BaseApiTokenService => {
  switch (accountType) {
    case 'bitbucket-cloud':
      return bitbucketService
    case 'circleci':
      return circleCiService
    case 'github':
      return githubService
    default:
      throw new Error("Unknown accountType: " + accountType)
  }
}
export const isOAuthService = (service: BaseAuthService): service is BaseOAuthAuthService =>
  service.authorizationType === 'OAuth2'
export const isOAuthNoRefreshService = (service: BaseAuthService): service is BaseOAuthNoRefreshAuthService =>
  service.authorizationType === 'OAuth2-norefresh'
export const isApiTokenService = (service: BaseAuthService): service is BaseApiTokenService =>
  service.authorizationType === 'ApiToken'
