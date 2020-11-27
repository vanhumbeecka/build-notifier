import { shell } from "electron"
import { Repository } from './models/repository'

export const sendBuildFailedNotification = (repository: Repository): void => {
  const myNotification = new Notification("Build failed", {
    body: repository.name
    // icon: path.join(__static, '/icon_192x192.png')
  })
  myNotification.onclick = () => {
    shell.openExternal(repository.href.href)
  }
}
