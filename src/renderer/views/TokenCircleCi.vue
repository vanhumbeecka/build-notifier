<template>
  <el-main>
    <el-row class="bn-vertical-spacing">
      <el-alert
          style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);"
          type="info"
          :closable="false"
          effect="light">
        <div slot="title">
            Go to your CircleCI dashboard to get a valid token.
            Paste it here.
        </div>
        <el-link type="primary" :underline="false" @click="handleClick">Personal API Tokens</el-link>
      </el-alert>
    </el-row>
    <el-row>
      <el-input
          style="margin-bottom: 10px;"
          placeholder="CircleCI Token"
          v-model="token"
          size="mini"
          type="text">
        <i
            class="el-icon-key el-input__icon"
            slot="prefix">
        </i>
      </el-input>
      <el-button size="mini" type="primary" @click="submitToken" :disabled="!validToken">Save token</el-button>
    </el-row>
  </el-main>
</template>
<script lang="ts">
import { ipcRenderer as ipc, shell } from 'electron'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Events } from '../../common/events'
import { AccountType } from '../../common/models/AccountType'
import { RouteNames } from '../router'
import { AccountModule } from '../store'

@Component({})
  export default class TokenCircleCiComponent extends Vue {

    public token = ""

    public handleClick() {
      shell.openExternal('https://app.circleci.com/settings/user/tokens')
    }

    public submitToken(): void {
      const accountType: AccountType = 'circleci'
      ipc.send(Events.START_AUTH_FLOW, {accountType, token: this.token})
    }

    get validToken(): boolean {
      return !!this.token && this.token.length > 0;
    }

    get localToken() {
      return AccountModule.circleCiToken
    }

    @Watch('localToken')
    public handleRedirectAfterTokenSubmit() {
      this.$router.push({name: RouteNames.HOME})
    }
  }
</script>

