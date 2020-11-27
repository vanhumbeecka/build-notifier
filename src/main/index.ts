'use strict'

import * as Sentry from '@sentry/electron'
import { app, ipcMain as ipc } from 'electron'
import log, { ElectronLog } from 'electron-log'
import { autoUpdater, Logger } from 'electron-updater'
import { Menubar } from 'menubar'
import * as path from 'path'
import { format as formatUrl } from 'url'
import { BaseApiTokenService } from '../common/BaseApiTokenService'
import { BaseOAuthAuthService } from '../common/BaseOAuthAuthService'
import { BaseOAuthNoRefreshAuthService } from '../common/BaseOAuthNoRefreshAuthService'
import { CircleCiAuthService } from '../common/CircleCiAuthService'
import { Events } from '../common/events'
import { GithubAuthService } from '../common/GithubAuthService'
import { AccountType } from '../common/models/AccountType'
import { CircleBuildResponse } from '../common/models/CirlceBuildResponse'
import { GithubBuildResponse } from '../common/models/GithubBuildResponse'
import { getAuthService, isApiTokenService, isOAuthNoRefreshService, isOAuthService, logEvent } from '../common/utils'
import {
  requestBuildInfoCircleCi, requestBuildInfoGithubActions,
  requestProjectInfoCircleCi,
  requestProjectInfoGithub
} from './apis'
import * as auth from './auth'
import { changeAutoLaunchOption } from './autolauncher'
import { myMenubar, setTrayIcon } from './menubar'
import { isDevelopment } from './utils'
import Timeout = NodeJS.Timeout


if (!isDevelopment) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN
  })
}

autoUpdater.logger = log as Logger
(autoUpdater.logger as ElectronLog).transports.file.level = 'info'
log.info('App starting...')

// global reference to mainWindow (necessary to prevent window from being garbage collected)
// let mainWindow: BrowserWindow | undefined | null
let mb: Menubar
let autoUpdateInterval: Timeout | undefined

const setAppVersionUpdate = (version: string) => {
  log.debug(version)
  mb.window?.webContents.send(Events.APP_VERSION, {version})
}

const afterWindowCreated = async () => {
  const window = mb.window

  if (isDevelopment) {
    try {
      // await session.defaultSession.removeExtension('/Users/andries/Library/Application Support/Google/Chrome/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd')
      // require('vue-devtools').install()
      // await session.defaultSession.loadExtension('/Users/andries/Library/Application Support/Google/Chrome/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.3.3_0')
    } catch (e) {
      log.error(e)
    }
    setTimeout(() => {
      window?.webContents.openDevTools()
    }, 3000)
  }

  if (isDevelopment) {
    window?.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  } else {
    window?.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'), protocol: 'file', slashes: true
    }))
  }

  window?.webContents.on('devtools-opened', () => {
    window?.focus()
    setImmediate(() => {
      window?.focus()
    })
  })

  ipc.on(Events.APP_VERSION_SYNC, async (event) => {
    logEvent(Events.APP_VERSION_SYNC)
    event.returnValue = app.getVersion()
  })

  ipc.on(Events.REQUEST_HAS_TOKEN, async (event, arg) => {
    logEvent(Events.REQUEST_HAS_TOKEN, arg.accountType)
    const authService = getAuthService(arg.accountType as AccountType)
    const hasToken = await authService.hasToken()
    event.returnValue = hasToken
  })

  ipc.on(Events.START_AUTH_FLOW, async (event, arg) => {
    logEvent(Events.START_AUTH_FLOW, arg.accountType)

    const authService = getAuthService(arg.accountType as AccountType)
    if (arg.meta) {
      authService.setMeta(arg.meta)
    }

    if (isOAuthService(authService)) {
      try {
        const [ok, reason] = await authService.refreshTokens() // checks memory for tokens, if not there calls refresh and stores it + set accesstoken
        if (!ok) {
          logEvent(Events.START_AUTH_FLOW, `Failed refreshing tokens: ${reason}`)
          auth.createAuthWindow(mb, authService) // load tokens
          return
        }

        const accessToken = await authService.getAccessTokenForRenderer()
        window?.webContents.send(Events.AUTHENTICATED, {accessToken, accountType: arg.accountType})
      } catch (err) {
        Sentry.captureException(err)
        logEvent(Events.START_AUTH_FLOW, `Failed refreshing tokens: ${err?.message}`)
        auth.createAuthWindow(mb, authService) // load tokens
      }
    } else if (isOAuthNoRefreshService(authService)) {
      const accessToken = await authService.getAccessTokenForRenderer() // there is only 1
      if (accessToken) {
        window?.webContents.send(Events.AUTHENTICATED, {accessToken, accountType: arg.accountType})
        return
      }

      logEvent(Events.START_AUTH_FLOW, `No accessToken found. Requesting now...`)
      auth.createAuthWindow(mb, authService) // loads tokens
    } else if (isApiTokenService(authService)) {
      const storedToken = await authService.getToken()
      if (!arg.token && storedToken) {
        mb.window?.webContents.send(Events.AUTHENTICATED, {
          accessToken: storedToken,
          accountType: authService.accountType
        })
      } else if (arg.token) {
        await authService.storeToken(arg.token)
        const storedToken = await authService.getToken()
        mb.window?.webContents.send(Events.AUTHENTICATED, {
          accessToken: storedToken,
          accountType: authService.accountType
        })
      }
      mb.showWindow()
    }
  })

  ipc.on(Events.START_LOGOUT_FLOW, async (event, arg) => {
    logEvent(Events.START_LOGOUT_FLOW, arg.accountType)
    const authService: BaseOAuthAuthService | BaseApiTokenService = getAuthService(arg.accountType as AccountType)


    if (isApiTokenService(authService)) {
      authService.logout()
      mb.window?.webContents.send(Events.LOGOUT_COMPLETE, {accountType: arg.accountType})
      return
    } else if (isOAuthService(authService)) {
      if ((authService as BaseOAuthAuthService).getLogOutUrl()) {
        auth.createLogoutWindow(mb, authService)
      } else {
        await (authService as BaseOAuthAuthService).logout()
        mb.window?.webContents.send(Events.LOGOUT_COMPLETE, {accountType: arg.accountType})
      }
    } else if (isOAuthNoRefreshService(authService)) {
      if ((authService as BaseOAuthNoRefreshAuthService).getLogOutUrl()) {
        auth.createLogoutWindow(mb, authService)
      } else {
        await (authService as BaseOAuthNoRefreshAuthService).logout()
        mb.window?.webContents.send(Events.LOGOUT_COMPLETE, {accountType: arg.accountType})
      }
    }
  })

  /**
   * Send requests from Node to bypass CORS restrictions
   */
  ipc.on(Events.REQUEST_PROJECT_INFO, async (event, arg) => {
    const {accountType} = arg as { accountType: AccountType, token: string }

    let response: unknown
    if (accountType === 'circleci') {
      const authService = getAuthService(accountType) as CircleCiAuthService
      try {
        const token = await authService.getToken()
        if (!token) {
          console.error('no circleci token found')
          event.returnValue = undefined
          return;
        }

        response = await requestProjectInfoCircleCi(token)
        event.returnValue = response
      } catch (e) {
        console.error(e)
        event.returnValue = undefined
      }
    } else if (accountType === 'github') {
      const authService = getAuthService(accountType) as GithubAuthService
      try {
        const token = await authService.getToken()
        if (!token) {
          console.error('no circleci token found')
          event.returnValue = undefined
          return;
        }
        response = await requestProjectInfoGithub(token)
        event.returnValue = response
      } catch (e) {
        console.error(e)
        event.returnValue = undefined
      }
    } else {
      event.returnValue = undefined
    }
  })

  ipc.on(Events.REQUEST_BUILD_INFO, async (event, arg) => {
    const params = arg as { accountType: AccountType, token: string, workspaceAndRepo: string }
    if (params.accountType === 'circleci') {
      const authService = getAuthService('circleci') as CircleCiAuthService
      const token = await authService.getToken()
      if (!token) {
        console.error("no circleci token found")
        event.returnValue = undefined
        return
      }
      let response: CircleBuildResponse[]
      try {
        response = await requestBuildInfoCircleCi(token, params.workspaceAndRepo)
        event.returnValue = response
      } catch (e) {
        console.error(e)
        event.returnValue = undefined
      }
    } else if (params.accountType === 'github') {
      const authService = getAuthService('github') as GithubAuthService
      const token = await authService.getToken()
      if (!token) {
        console.error("no circleci token found")
        event.returnValue = undefined
        return
      }
      let response: GithubBuildResponse
      try {
        response = await requestBuildInfoGithubActions(token, params.workspaceAndRepo)
        event.returnValue = response
      } catch (e) {
        console.error(e)
        event.returnValue = undefined
      }
    } else {
      event.returnValue = undefined
    }
  })

  /**
   * Icon changer
   */
  ipc.on(Events.BUILD_STATUS_CHANGED, async (event, arg) => {
    logEvent(Events.BUILD_STATUS_CHANGED, arg.outcome)
    setTrayIcon(mb, arg.outcome)
  })

  ipc.on(Events.APP_CONFIG_REQUESTED, async () => {
    setAppVersionUpdate(app.getVersion())
  })


  ipc.on(Events.APP_AUTO_UPDATES, async (event, arg) => {
    logEvent(Events.APP_AUTO_UPDATES, arg.enabled)
    const {enabled} = arg
    if (enabled && !autoUpdateInterval) {
      autoUpdater.checkForUpdatesAndNotify()
      autoUpdateInterval = setInterval(() => {
        autoUpdater.checkForUpdatesAndNotify()
      }, 60 * 60 * 1000) // every hour
    } else if (!enabled && autoUpdateInterval) {
      clearInterval(autoUpdateInterval)
      autoUpdateInterval = undefined
    }
  })

  ipc.on(Events.APP_AUTO_START, async (event, arg) => {
    logEvent(Events.APP_AUTO_START, arg.enabled)
    const {enabled} = arg
    const result = await changeAutoLaunchOption(enabled)

    event.returnValue = result
  })

  ipc.on(Events.APP_QUIT, async () => {
    mb.app.quit()
  })

}

async function main(): Promise<void> {
  mb = myMenubar
  mb.on('after-create-window', afterWindowCreated)
  // mb.on('after-show', () => {
  //   log.debug('after-show')
  // })

  mb.on('window-all-closed', () => {
    mb.app.quit()
  })
}

main()
