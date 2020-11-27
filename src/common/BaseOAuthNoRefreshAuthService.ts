import axios, { AxiosResponse } from 'axios'
import { BaseOAuthAuthService } from './BaseOAuthAuthService'
import { AccountType } from './models/AccountType'
import { AuthorizationType } from './models/AuthorizationType'


export abstract class BaseOAuthNoRefreshAuthService extends BaseOAuthAuthService {

  public readonly authorizationType: AuthorizationType = "OAuth2-norefresh"

  protected constructor(accountType: AccountType) {
    super(accountType)
  }

  async getAccessTokenForRenderer(): Promise<string> {
    if (this.accessToken) {
      return Promise.resolve(this.accessToken)
    }
    const hasToken = await this.hasToken()
    if (hasToken) {
      return "{placeholder}"
    }
    return ""
  }

  abstract getKeyTarService(): string;
  abstract getAuthenticationURL(): string
  abstract getLogOutUrl(): string | undefined

  /**
   * Overwrite
   */
  async loadTokens(callbackUrl: string) {
    let response: AxiosResponse
    try {
      response = await axios({
        url: callbackUrl, method: 'GET'
      })
    } catch (e) {
      await this.logout()
      throw e
    }

    try {
      const data = response.data

      this.accessToken = data.access_token

      if (this.accessToken) {
        // e.g. Github only has perpetual accessTokens, no refreshTokens
        await this.storeToken(this.accessToken)
      }
    } catch (e) {
      await this.logout()
      throw e
    }
  }
}
