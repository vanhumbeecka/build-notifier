import { BitbucketAuthService } from './BitbucketAuthService'
import { CircleCiAuthService } from './CircleCiAuthService'
import { GithubAuthService } from './GithubAuthService'

export const bitbucketService = new BitbucketAuthService()
export const circleCiService = new CircleCiAuthService()
export const githubService = new GithubAuthService()
