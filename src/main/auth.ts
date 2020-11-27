import {BrowserWindow} from 'electron'
import {Menubar} from 'menubar'
import {Events} from '../common/events'
import {BaseOAuthAuthService} from '../common/BaseOAuthAuthService'

let win: BrowserWindow | null = null;

function createAuthWindow(mb: Menubar, authService: BaseOAuthAuthService): void {
    destroyAuthWin();

    win = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: false
        }
    });

    // win.webContents.openDevTools();
    const { session: { webRequest } } = win.webContents;
    
    const filter = {
        urls: [
            'https://api.buildnotifier.app/auth/bitbucket/callback*',
            'https://api-dev.buildnotifier.app/auth/bitbucket/callback*',
            'https://api.buildnotifier.app/auth/github/callback*',
            'https://api-dev.buildnotifier.app/auth/github/callback*',
        ]
    };


    webRequest.onBeforeRequest(filter, async (details) => {
        const { url } = details

        await authService.loadTokens(url); // parses `code`, requests tokens, and stores them with keytar
        destroyAuthWin();
        const accessToken = await authService.getAccessTokenForRenderer()

        mb.window?.webContents.send(Events.AUTHENTICATED, {accessToken, accountType: authService.accountType});
        mb.showWindow()
        return
    });

    win.loadURL(authService.getAuthenticationURL())

    win.on('closed', () => {
        win = null;
    });
}

function destroyAuthWin() {
    if (!win) {
        return;
    }
    win.close();
    win = null;
}

async function createLogoutWindow(mb: Menubar, authService: BaseOAuthAuthService): Promise<void> {
    const logoutWindow: BrowserWindow = new BrowserWindow({
        show: false,
    });
    const uri = authService.getLogOutUrl()
    if (uri) {
        await logoutWindow.loadURL(uri);
        const ses = logoutWindow.webContents.session
        await ses.clearStorageData({storages: ["cookies"]})
        logoutWindow.close()
    } else {
        logoutWindow.on('ready-to-show', async () => {
            logoutWindow.close();
        });
    }

    await authService.logout();
    mb.window?.webContents.send(Events.LOGOUT_COMPLETE, {accountType: authService.accountType})
}


export {
    createAuthWindow,
    createLogoutWindow,
};
