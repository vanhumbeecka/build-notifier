import {Menubar, menubar} from 'menubar'
import path from 'path'
import {nativeImage} from 'electron'
import {Outcome} from '../renderer/store/models/build'

const isDevelopment = process.env.NODE_ENV !== 'production'
const okImage = nativeImage.createFromPath(path.join(__static, '/buildnotifier.png'))
const badImage = nativeImage.createFromPath(path.join(__static, '/buildnotifier_bad.png'))

export const myMenubar: Menubar = menubar({
    browserWindow: {
        width: isDevelopment ? 1000 : 400,
        height: isDevelopment ? 600 : 500,
        webPreferences: {
            nodeIntegration: true
        }
    },
    index: false,
    icon: okImage
})

export const setTrayIcon = (mb: Menubar, outcome: Outcome): void => {
    switch (outcome) {
        case 'FAILED':
            mb.tray.setImage(badImage)
            return
        default:
            mb.tray.setImage(okImage)
            return;
    }
}
