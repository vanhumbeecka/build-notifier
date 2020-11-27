import { ipcRenderer } from 'electron'
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Events } from '../../../common/events'
import { SettingsTab, Tabs } from '../models/menu'
import { OrderType } from '../models/order'


export interface IAppState {
  backButtonVisible: boolean
  currentTabView: Tabs
  version: string
  updateMessage: string
  autoLaunchEnabled: boolean
  notificationsEnabled: boolean
  autoUpdatesEnabled: boolean
}

@Module({namespaced: true, name: 'app'})
export class App extends VuexModule implements IAppState {
  backButtonVisible = false
  currentTabView: Tabs = 'build'
  currentSettingsTabView: SettingsTab = 'general'
  version = ''
  updateMessage = ''
  autoLaunchEnabled = false
  notificationsEnabled = false
  autoUpdatesEnabled = false

  // layout
  buildOrder: OrderType = 'most-recent'

  @Mutation
  public setAutoUpdatesStatus(enabled: boolean): void {
    ipcRenderer.send(Events.APP_AUTO_UPDATES, {enabled})
    this.autoUpdatesEnabled = enabled
  }

  @Mutation
  public setNotificationStatus(enabled: boolean): void {
    this.notificationsEnabled = enabled
  }

  @Mutation
  public setUpdateMessage(message: string): void {
    this.updateMessage = message
  }

  @Mutation
  public setAutoLaunch(enabled: boolean): void {
    this.autoLaunchEnabled = enabled
  }

  @Mutation
  public setVersion(version: string): void {
    this.version = version
  }

  @Mutation
  public showBackButton(show: boolean): void {
    this.backButtonVisible = show
  }

  @Mutation
  public setTabView(tabView: Tabs): void {
    this.currentTabView = tabView
  }

  @Mutation
  public setSettingsTabView(tabView: SettingsTab): void {
    this.currentSettingsTabView = tabView
  }

  @Mutation
  public setBuildOrderType(order: OrderType): void {
    this.buildOrder = order
  }

  @Action
  public setError(e: any): Promise<void> {
    console.group('APP ERROR')
    console.error(e)
    console.groupEnd()

    // TODO: add Sentry.io for error logging

    return Promise.resolve()
  }
}
