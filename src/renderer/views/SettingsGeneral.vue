<template>
    <el-main>
      <div class="bn-flex-vertical">
        <settings-row>
          <template v-slot>Run at login</template>
          <template v-slot:right>
            <el-switch v-model="autostartEnabled"
                       :disabled="changingAutoLaunchState">
            </el-switch>
          </template>
        </settings-row>
        <settings-row>
          <template v-slot>Notification on failed build</template>
          <template v-slot:right>
            <el-switch v-model="notificationEnabled">
            </el-switch>
          </template>
        </settings-row>
        <settings-row>
          <template v-slot>Allow auto-updates</template>
          <template v-slot:right>
            <el-switch v-model="autoUpdatesEnabled">
            </el-switch>
          </template>
        </settings-row>
        <settings-row>
          <template v-slot>Polling interval (seconds)</template>
          <template v-slot:right>
            <el-input-number v-model="pollingInterval"
                             size="mini"
                             :step="10"
                             :min="10"
                             step-strictly>
            </el-input-number>
          </template>
        </settings-row>
        <span class="flex-item"></span>
        <el-button type="btn" size="mini" style="width: 100%" @click="quitApp()">Quit Build Notifier</el-button>
      </div>
    </el-main>
</template>
<script lang="ts">
import { ipcRenderer as ipc } from 'electron'
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Events } from '../../common/events'
import TextRowComponent from '../components/TextRow.vue'
import { AppModule, ManageModule } from '../store'

@Component({
  components: {
    'settings-row': TextRowComponent
  }
})
export default class SettingsGeneralComponent extends Vue {

  public changingAutoLaunchState = false

  mounted(): void {
    ipc.send(Events.APP_CONFIG_REQUESTED)
  }

  get pollingInterval(): number {
    return ManageModule.pollingSeconds
  }

  set pollingInterval(seconds: number) {
    ManageModule.setPollingSeconds(seconds)
  }

  get autostartEnabled(): boolean {
    return AppModule.autoLaunchEnabled
  }

  set autostartEnabled(enabled: boolean) {
    this.changingAutoLaunchState = true
    const isEnabled = ipc.sendSync(Events.APP_AUTO_START, {enabled})
    AppModule.setAutoLaunch(isEnabled)
    this.changingAutoLaunchState = false
  }

  get notificationEnabled(): boolean {
    return AppModule.notificationsEnabled
  }

  set notificationEnabled(enabled: boolean) {
    AppModule.setNotificationStatus(enabled)
  }

  get autoUpdatesEnabled(): boolean {
    return AppModule.autoUpdatesEnabled
  }

  set autoUpdatesEnabled(enabled: boolean) {
    AppModule.setAutoUpdatesStatus(enabled)
  }

  public quitApp(): void {
    ipc.send(Events.APP_QUIT)
    console.log('quiting')
  }
}
</script>
