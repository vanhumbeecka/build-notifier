import * as keytar from 'keytar'
import os from "os"
import { BaseAuthService } from './BaseAuthService'
import { AccountType } from './models/AccountType'
import { AuthorizationType } from './models/AuthorizationType'

export abstract class BaseApiTokenService implements BaseAuthService {

  public readonly authorizationType: AuthorizationType = 'ApiToken'
  public readonly accountType: AccountType;
  protected meta: any;

  protected constructor(accountType: AccountType) {
    this.accountType = accountType;
  }

  get keytarAccount(): string {
    return os.userInfo().username
  }

  abstract getKeyTarService(): string;

  setMeta(meta: any) {
    this.meta = meta
  }

  async getToken(): Promise<string | null> {
    return keytar.getPassword(this.getKeyTarService(), this.keytarAccount)
  }

  async storeToken(token: string): Promise<void> {
    await keytar.setPassword(this.getKeyTarService(), this.keytarAccount, token)
  }

  async hasToken(): Promise<boolean> {
    const token = await this.getToken()
    return !!token
  }

  async logout(): Promise<void> {
    await keytar.deletePassword(this.getKeyTarService(), this.keytarAccount)
  }
}
