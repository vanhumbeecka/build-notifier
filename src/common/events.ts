import { ipcRenderer as ipc } from 'electron'
import { AccountType } from './models/AccountType'

export const Events = {
    LOGOUT_COMPLETE: 'logout-complete',
    AUTHENTICATED: 'authenticated',
    START_AUTH_FLOW: "start-auth-flow",
    START_REFRESH_FLOW: "start-refresh-flow",
    START_LOGOUT_FLOW: "start-logout-flow",
    UPDATE_MESSAGE: "update-message",
    APP_VERSION: "app-version",
    APP_VERSION_SYNC: "app-version-sync",
    BUILD_STATUS_CHANGED: "build-status-changed",
    APP_CONFIG_REQUESTED: "app-config-requested",
    REQUEST_PROJECT_INFO: "request-project-info",
    REQUEST_BUILD_INFO: "request-build-info",
    REQUEST_HAS_TOKEN: "request-has-token",
    APP_AUTO_UPDATES: "app-auto-updates",
    APP_AUTO_START: "app-auto-start",
    APP_QUIT: "app-quit"
}

export const Actions = {
    startAuthFlow: (accountType: AccountType, token?: string, meta?: any): void =>
      ipc.send(Events.START_AUTH_FLOW, {accountType, token, meta}),
    requestProjectInfo: <T>(accountType: AccountType, token: string): T =>
      ipc.sendSync(Events.REQUEST_PROJECT_INFO, {accountType, token}),
    requestBuildInfo: <T>(accountType: AccountType, token: string, workspaceAndRepo: string): T =>
      ipc.sendSync(Events.REQUEST_BUILD_INFO, {accountType, token, workspaceAndRepo})
}

