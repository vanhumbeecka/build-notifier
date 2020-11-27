import { isDevelopment } from '../main/utils'
import { BaseOAuthAuthService } from "./BaseOAuthAuthService";

export class BitbucketAuthService extends BaseOAuthAuthService {

    private readonly apiSubDomain: string

    constructor() {
        super("bitbucket-cloud")
        this.apiSubDomain = isDevelopment ? "api-dev" : "api"
    }

    getKeyTarService(): string {
        if (isDevelopment) {
            return "be.codemine.build-notifier-dev.bitbucket"
        }
        return "be.codemine.build-notifier.bitbucket"
    }

    getAuthenticationURL(): string {
        return `https://${this.apiSubDomain}.buildnotifier.app/auth/bitbucket`
    }

    getRefreshTokenURL(): string {
        return `https://${this.apiSubDomain}.buildnotifier.app/auth/bitbucket/refresh`
    }

    getLogOutUrl(): string {
        return "https://id.atlassian.com/logout";
    }

}
