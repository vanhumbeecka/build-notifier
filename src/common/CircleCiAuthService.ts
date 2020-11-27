import { isDevelopment } from '../main/utils'
import { BaseApiTokenService } from './BaseApiTokenService'

export class CircleCiAuthService extends BaseApiTokenService {

  constructor() {
    super("circleci");
  }

  getKeyTarService(): string {
    if (isDevelopment) {
      return "be.codemine.build-notifier-dev.circleci"
    }
    return "be.codemine.build-notifier.circleci";
  }

}
