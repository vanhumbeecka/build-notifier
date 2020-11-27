import Vue from 'vue'
import Vuex from 'vuex'
import { App, IAppState } from './modules/app'
import { getModule } from 'vuex-module-decorators'
import { Account, IAccountState } from './modules/account'
import { createPersistedState } from 'vuex-electron'
import { IManageState, Manage } from './modules/manage'
import { config } from "vuex-module-decorators"
config.rawError = true

Vue.use(Vuex)

export interface IRootState {
  app: IAppState,
  account: IAccountState,
  manage: IManageState
}

const store = new Vuex.Store<IRootState>({
  strict: process.env.NODE_ENV !== 'production', modules: {
    app: App, account: Account, manage: Manage
  }, plugins: [createPersistedState({
    blacklist: ['account']
  })]
})



const AppModule = getModule<App>(App, store)
const AccountModule = getModule<Account>(Account, store)
const ManageModule = getModule<Manage>(Manage, store)

export default store

export {
  AppModule, AccountModule, ManageModule
}
