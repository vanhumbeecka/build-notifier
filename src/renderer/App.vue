<template>
  <el-container style="height: 100%;" direction="vertical">
    <bn-header/>
    <transition name="slide-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </el-container>
</template>

<script lang="ts">
import { ipcRenderer as ipc } from 'electron'
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Events } from '../common/events'
import { AccountType } from '../common/models/AccountType'
import FooterComponent from './components/Footer.vue'
import HeaderComponent from './components/Header.vue'
import { AccountModule, AppModule, ManageModule } from './store'

@Component({
  components: {
    'bn-header': HeaderComponent, 'bn-footer': FooterComponent
  }
})
export default class App extends Vue {

  created(): void {
    ipc.on(Events.UPDATE_MESSAGE, (event, args) => {
      AppModule.setUpdateMessage(args?.message)
    })
    ipc.on(Events.APP_VERSION, (event, args) => {
      AppModule.setVersion(args?.version || '')
    })
  }

  mounted(): void {
    ipc.on(Events.AUTHENTICATED, (event, args) => {
      console.log('authenticated', args.accountType)
      AccountModule.resetUser(args?.accountType)
      AccountModule.initUser({token: args.accessToken, accountType: args.accountType})
    })
    ipc.on(Events.LOGOUT_COMPLETE, (event, args) => {
      console.log('logout')
      AccountModule.resetUser(args?.accountType)
    })

    /**
     * Build status icon change
     */
    ipc.send(Events.BUILD_STATUS_CHANGED, {outcome: ManageModule.globalBuildStatus})

    /**
     * Auto update enabled
     */
    ipc.send(Events.APP_AUTO_UPDATES, {enabled: AppModule.autoUpdatesEnabled})

    /**
     * CircleCI account connection
     */
    const accountTypeCircleCi: AccountType = 'circleci'
    ipc.send(Events.START_AUTH_FLOW, {accountType: accountTypeCircleCi})

    /**
     * Bitbucket account Connection
     */
    const accountTypeBitbucket: AccountType = 'bitbucket-cloud'
    const hasToken = ipc.sendSync(Events.REQUEST_HAS_TOKEN, {accountType: accountTypeBitbucket})
    if (hasToken) {
      ipc.send(Events.START_AUTH_FLOW, {accountType: accountTypeBitbucket})
    }

    /**
     * GithubApi account Connection
     */
    const accountTypeGithub: AccountType = 'github'
    const hasTokenGithub = ipc.sendSync(Events.REQUEST_HAS_TOKEN, {accountType: accountTypeGithub})
    if (hasTokenGithub) {
      ipc.send(Events.START_AUTH_FLOW, {accountType: accountTypeGithub})
    }
  }
}
</script>
<style>
.slide-fade-enter-active, .slide-fade-leave-active{
  transition: all .2s ease;
}

.slide-fade-enter, .slide-fade-leave-to
{
  opacity: 0;
}
</style>
