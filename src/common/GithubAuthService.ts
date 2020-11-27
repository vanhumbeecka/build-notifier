import { isDevelopment } from '../main/utils'
import { BaseOAuthNoRefreshAuthService } from './BaseOAuthNoRefreshAuthService'

export class GithubAuthService extends BaseOAuthNoRefreshAuthService {

  private readonly apiSubDomain: string
  private readonly clientId: string

  constructor() {
    super("github")
    this.apiSubDomain = isDevelopment ? "api-dev" : "api"
    this.clientId = isDevelopment ? "31fcd566c686ce67e60a" : "654969e9d5a241ceafd8"
  }

  getKeyTarService(): string {
    if (isDevelopment) {
      return "be.codemine.build-notifier-dev.github"
    }
    return "be.codemine.build-notifier.github"
  }

  getAuthenticationURL(): string {
    let url = `https://${this.apiSubDomain}.buildnotifier.app/auth/github`
    if (this.meta?.private) {
      url = `${url}?private=true`
    }
    return url
  }

  getRefreshTokenURL(): string {
    return `https://${this.apiSubDomain}.buildnotifier.app/auth/github/refresh`
  }

  getLogOutUrl(): string {
    return `https://github.com/settings/connections/applications/${this.clientId}`
  }

}
