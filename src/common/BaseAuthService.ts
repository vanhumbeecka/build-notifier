import { AccountType } from './models/AccountType'
import { AuthorizationType } from './models/AuthorizationType'

export interface BaseAuthService {
  authorizationType: AuthorizationType;
  accountType: AccountType
  keytarAccount: string
  setMeta(meta: any): void
  getKeyTarService(): string
  storeToken(token: string): Promise<void>
  getToken(): Promise<string | null>
  hasToken(): Promise<boolean>
  logout(): Promise<void>
}
