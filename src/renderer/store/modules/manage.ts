import { ipcRenderer as ipc } from 'electron'
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Events } from '../../../common/events'
import { AccountType } from '../../../common/models/AccountType'
import { fetchOutcomeOfMostRecentBuild } from '../../../common/utils'
import { bitbucketApi } from '../../api/BitbucketApi'
import { circleCiApi } from '../../api/CircleCiApi'
import { githubApi } from '../../api/GithubApi'
import { IRootState } from '../index'
import { Outcome } from '../models/build'
import { Repository } from '../models/repository'
import { RepositoryBuilds } from '../models/repository-builds'
import { sendBuildFailedNotification } from '../side-effects'

export interface IManageState {
  buildInfo: RepositoryBuilds[]
  projects: Repository[]
  projectSearchIds: string[]
  projectSearching: boolean
  pollingSeconds: number
  globalBuildStatus: Outcome
  individualBuildStatus: Array<{repository: Repository, outCome: Outcome}>
}

@Module({namespaced: true, name: 'manage'})
export class Manage extends VuexModule implements IManageState {

  buildInfo: RepositoryBuilds[] = []
  projects: Repository[] = []
  projectSearchIds: string[] = []
  projectSearching = false
  pollingSeconds = 30
  globalBuildStatus: Outcome = 'UNKNOWN'
  individualBuildStatus: Array<{repository: Repository, outCome: Outcome}> = []

  timeoutId: NodeJS.Timeout | undefined

  @Mutation
  setPollingSeconds(seconds: number) {
    if (!seconds || seconds < 10) {
      this.pollingSeconds = 10
    } else {
      this.pollingSeconds = seconds
    }
  }

  @Mutation
  setProjectToSelected(id: string) {
    const repository = this.projects.find(p => p.id === id)
    if (!repository) {
      return
    }

    const modified: Repository = {...repository, selected: true}
    this.projects = [...this.projects.filter(p => p.id !== repository.id), modified]
  }

  @Mutation
  setProjectToUnselected(id: string) {
    const repository = this.projects.find(p => p.id === id)
    if (!repository) {
      return
    }

    const modified: Repository = {...repository, selected: false}
    this.projects = [...this.projects.filter(u => u.id !== repository.id), modified]
  }

  @Mutation
  updateBuildInfo(buildInfo: RepositoryBuilds[]) {
    this.buildInfo = buildInfo
  }

  @Mutation
  updateGlobalBuildStatus(buildInfo: RepositoryBuilds[]) {
    const allOutcomes: Outcome[] = buildInfo.map(r => fetchOutcomeOfMostRecentBuild(r.builds))

    if (allOutcomes.some(o => o === 'FAILED')) {
      if (this.globalBuildStatus === 'FAILED') {
        return; // if globalBuildStatus was already in failed, return.
      }
      ipc.send(Events.BUILD_STATUS_CHANGED, {outcome: 'FAILED'})
      this.globalBuildStatus = 'FAILED'
    } else if (allOutcomes.some(o => o === 'ONGOING')) {
      if (this.globalBuildStatus === 'ONGOING') {
        return;
      }
      ipc.send(Events.BUILD_STATUS_CHANGED, {outcome: 'ONGOING'})
      this.globalBuildStatus = 'ONGOING'
    } else if (allOutcomes.some(o => o === 'SUCCESSFUL')) {
      if (this.globalBuildStatus === 'SUCCESSFUL') {
        return;
      }
      ipc.send(Events.BUILD_STATUS_CHANGED, {outcome: 'SUCCESSFUL'})
      this.globalBuildStatus = 'SUCCESSFUL'
    }
  }

  @Mutation
  updateIndividualBuildStatus(payload: {buildInfo: RepositoryBuilds[], notificationsEnabled: boolean}) {
    const newOutcomes: {repository: Repository, outCome: Outcome}[] = payload.buildInfo.map(r => ({
      repository: r.repository,
      outCome: fetchOutcomeOfMostRecentBuild(r.builds)
    }))

    if (payload.notificationsEnabled) {
      newOutcomes.forEach(n => {
        const existingOutcome = this.individualBuildStatus.find(i => i.repository.id === n.repository.id)
        if (existingOutcome) {
          if (existingOutcome.outCome === 'FAILED') {
            return
          } else if (n.outCome === 'FAILED') {
            sendBuildFailedNotification(n.repository)
          }
        } else {
          if (n.outCome === 'FAILED') {
            sendBuildFailedNotification(n.repository)
          }
        }
      })
    }

    this.individualBuildStatus = newOutcomes
  }

  @Mutation
  updateProjectInfo(repositories: Repository[]) {
    repositories.forEach(r => {
      const localProject = this.projects.find(p => p.id === r.id)
      if (localProject) {
        const project: Repository = {...r, selected: localProject.selected}
        this.projects = [...this.projects.filter(p => p.id !== r.id), project]
      } else {
        this.projects.push(r)
      }
    })
  }

  @Mutation
  addSearchIds(ids: string[]) {
    this.projectSearchIds = [...this.projectSearchIds.filter(id => !ids.includes(id)), ...ids]
    this.projectSearching = true
  }

  @Mutation
  clearSearchIds() {
    this.projectSearchIds = []
  }

  @Mutation
  setSearchFilter(filter: boolean) {
    this.projectSearching = filter
  }

  @Action({rawError: true})
  public async searchProjects(payload: {search: string, accountTypes: AccountType[]}) {
    const {search, accountTypes} = payload
    const projectInfo: Repository[] = []
    try {
      if (!search) {
        this.context.commit('setSearchFilter', false)
        return
      }
      let promiseBitbucket: Promise<Repository[]> | undefined
      let promiseCircle: Promise<Repository[]> | undefined
      let promiseGithub: Promise<Repository[]> | undefined

      if (accountTypes.includes("bitbucket-cloud")) {
        promiseBitbucket = bitbucketApi.requestProjectInfo(search)
      }
      if (accountTypes.includes("circleci")) {
        promiseCircle = circleCiApi.requestProjectInfo(search)
      }
      if (accountTypes.includes("github")) {
        promiseGithub = githubApi.requestProjectInfo(search)
      }

      if (promiseBitbucket){
        try {
          const projects = await promiseBitbucket;
          projectInfo.push(...projects)
        } catch (e) {
          await this.context.dispatch('app/setError', e, {root: true})
        }
      }

      if (promiseCircle) {
        try {
          const projects = await promiseCircle;
          projectInfo.push(...projects)
        } catch (e) {
          await this.context.dispatch('app/setError', e, {root: true})
        }
      }

      if (promiseGithub) {
        try {
          const projects = await promiseGithub;
          projectInfo.push(...projects)
        } catch (e) {
          await this.context.dispatch('app/setError', e, {root: true})
        }
      }

      this.context.commit('updateProjectInfo', projectInfo)
      this.context.commit('clearSearchIds')
      this.context.commit('addSearchIds', projectInfo.map(p => p.id))

    } catch (e) {
      await this.context.dispatch('app/setError', e, {root: true})
    }
  }

  @Action({rawError: true})
  public async fetchMyBuildData() {
    const promises: Promise<RepositoryBuilds>[] =
      this.projects
        .filter(p => p.selected)
        .map(f => {
          if (f.accountType === 'bitbucket-cloud') {
            return bitbucketApi.requestBuildInfo(f.fullname)
              .then(b => ({repository: f, builds: b} as RepositoryBuilds))
          } else if (f.accountType === 'circleci') {
            return circleCiApi.requestBuildInfo(f.fullname)
              .then(b => ({repository: f, builds: b} as RepositoryBuilds))
          } else if (f.accountType === 'github') {
            return githubApi.requestBuildInfo(f.fullname)
              .then(b => ({repository: f, builds: b} as RepositoryBuilds))
          } else {
            // backwards-compatible: return bitbucket pipelines (if any)
            return bitbucketApi.requestBuildInfo(f.fullname)
              .then(b => ({repository: f, builds: b} as RepositoryBuilds))
          }
        })

    try {
      const respositoryBuilds = await Promise.all(promises)
      this.context.commit('updateBuildInfo', respositoryBuilds)
      this.context.commit('updateGlobalBuildStatus', respositoryBuilds)

      const notificationsEnabled = (this.context.rootState as IRootState).app.notificationsEnabled

      this.context.commit('updateIndividualBuildStatus', {buildInfo: respositoryBuilds, notificationsEnabled: notificationsEnabled})
    } catch (e) {
      await this.context.dispatch('app/setError', e, {root: true})
    }
  }

  @Action({rawError: true})
  public async listenToMyBuildInfo() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }

    this.timeoutId = setInterval(() => {
      this.context.dispatch('fetchMyBuildData')
    }, this.pollingSeconds * 1000)

    await this.context.dispatch('fetchMyBuildData')
  }

}
