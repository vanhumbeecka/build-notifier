import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { AccountType } from '../../../common/models/AccountType'

export interface IAccountState {
  bitbucketAccessToken: string;
  circleCiToken: string;
  githubAccessToken: string;
}


@Module({namespaced: true, name: 'account'})
export class Account extends VuexModule implements IAccountState {
  bitbucketAccessToken = ''
  circleCiToken = ''
  githubAccessToken = ''

  get connectedAccounts(): AccountType[] {
    const accounts: AccountType[] = []
    if (this.isConnectedToBitbucketCloud) {
      accounts.push("bitbucket-cloud")
    }
    if (this.isConnectedToCircleCI) {
      accounts.push('circleci')
    }
    if (this.isConnectedToGithub) {
      accounts.push('github')
    }
    return accounts;
  }

  get bitbucketAuthHeader(): { key: string, value: string } {
    return {
      key: 'authorization', value: `Bearer ${this.bitbucketAccessToken}`
    }
  }

  get circleAuthHeader(): { key: string, value: string } {
    return {
      key: 'circle-token', value: this.circleCiToken
    }
  }

  get isConnectedToBitbucketCloud(): boolean {
    return !!this.bitbucketAccessToken
  }

  get isConnectedToCircleCI(): boolean {
    return !!this.circleCiToken
  }

  get isConnectedToGithub(): boolean {
    return !!this.githubAccessToken
  }

  @Mutation
  public setBitbucketAccessToken(token: string) {
    this.bitbucketAccessToken = token
  }

  @Mutation
  public setCircleCiToken(token: string) {
    this.circleCiToken = token
  }

  @Mutation
  public setGithubToken(token: string) {
    this.githubAccessToken = token
  }

  @Mutation
  public resetUser(accountType?: AccountType) {
    switch (accountType) {
      case 'bitbucket-cloud':
        this.bitbucketAccessToken = ''
        break
      case 'circleci':
        this.circleCiToken = ''
        break
      case 'github':
        this.githubAccessToken = ''
        break
      default:
        this.bitbucketAccessToken = ''
        this.circleCiToken = ''
        this.githubAccessToken = ''
    }
  }

  @Action
  public async initUser(payload: { token: string, accountType: AccountType }) {
    switch (payload.accountType) {
      case 'bitbucket-cloud':
        this.context.commit('setBitbucketAccessToken', payload.token)
        break
      case 'circleci':
        this.context.commit('setCircleCiToken', payload.token)
        break
      case 'github':
        this.context.commit('setGithubToken', payload.token)
        break
      default:
        throw new Error('Unknown accountType given: ' + payload.accountType)
    }
  }
}
