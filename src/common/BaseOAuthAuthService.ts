import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import * as keytar from 'keytar'
import * as os from 'os'
import { BaseAuthService } from './BaseAuthService'
import { AccountType } from './models/AccountType'
import { AuthorizationType } from './models/AuthorizationType'


export abstract class BaseOAuthAuthService implements BaseAuthService {

  public readonly authorizationType: AuthorizationType = "OAuth2"
  public readonly accountType: AccountType;
  protected accessToken = ''
  protected refreshToken = ''
  protected meta: any

  protected constructor(accountType: AccountType) {
    this.accountType = accountType;
  }

  setMeta(meta: any) {
    this.meta = meta
  }

  getAccessTokenForRenderer(): Promise<string> {
    return Promise.resolve(this.accessToken)
  }

  abstract getKeyTarService(): string;
  abstract getAuthenticationURL(): string
  abstract getRefreshTokenURL(): string
  abstract getLogOutUrl(): string | undefined

  get keytarAccount(): string {
    return os.userInfo().username
  }

  async storeToken(token: string): Promise<void> {
    await keytar.setPassword(this.getKeyTarService(), this.keytarAccount, token)
  }

  async getToken(): Promise<string | null> {
    return keytar.getPassword(this.getKeyTarService(), this.keytarAccount)
  }

  async hasToken(): Promise<boolean> {
    const token = await keytar.getPassword(this.getKeyTarService(), this.keytarAccount)
    return !!token
  }

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
      this.refreshToken = data.refresh_token

      if (this.refreshToken) {
        await this.storeToken(this.refreshToken)
      }
    } catch (e) {
      await this.logout()
      throw e
    }
  }

  async refreshTokens(): Promise<[boolean, string]> {
    const refreshToken = await keytar.getPassword(this.getKeyTarService(), this.keytarAccount)

    if (!refreshToken) {
      return Promise.resolve([false, 'No available refresh token'])
    }

    const refreshOptions: AxiosRequestConfig = {
      method: 'POST',
      url: this.getRefreshTokenURL(),
      data: {
        refreshToken: refreshToken
      }
    }

    try {
      const response = await axios(refreshOptions)
      this.accessToken = response.data.access_token
      const refreshToken = response.data.refresh_token

      await keytar.setPassword(this.getKeyTarService(), this.keytarAccount, refreshToken)
      return Promise.resolve([true, "New access token fetched from refresh token"])
    } catch (e) {
      await this.logout()

      throw e
    }
  }

  async logout(): Promise<void> {
    await keytar.deletePassword(this.getKeyTarService(), this.keytarAccount)
    this.accessToken = ''
    this.refreshToken = ''
  }
}
