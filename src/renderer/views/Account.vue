<template>
  <el-main>
    <account-row>
      <template v-slot>
        <span v-if="isConnectedToBitbucketCloud">
            <strong>Bitbucket Cloud</strong> connected
        </span>
        <span v-else class="bn-defocus">
            <strong>Bitbucket Cloud</strong> not connected
        </span>
      </template>
      <template v-slot:right>
        <connect :is-connected-to-account="isConnectedToBitbucketCloud"
                 :loading="loading"
                 @login-clicked="login('bitbucket-cloud')"
                 @logout-clicked="logout('bitbucket-cloud')"
        >
        </connect>
      </template>
    </account-row>
    <account-row>
      <template v-slot>
        <span v-if="isConnectedToGithub">
          <strong>Github Actions</strong> connected
        </span>
        <span v-else class="bn-defocus">
          <strong>Github Actions</strong> not connected
        </span>
      </template>
      <template v-slot:right>
        <connect :is-connected-to-account="isConnectedToGithub"
                 :loading="loading"
                 @login-clicked="login('github')"
                 @logout-clicked="logout('github')"
        >
        </connect>
      </template>
    </account-row>
    <account-row>
      <template v-slot>
        <span v-if="isConnectedToCircleCI">
            <strong>CircleCI</strong> connected
        </span>
        <span v-else class="bn-defocus">
            <strong>CircleCI</strong> not connected
        </span>
      </template>
      <template v-slot:right>
        <connect :is-connected-to-account="isConnectedToCircleCI"
                 :loading="loading"
                 @logout-clicked="logout('circleci')"
                 @login-clicked="login('circleci')">
        </connect>
      </template>
    </account-row>
  </el-main>
</template>
<script lang="ts">
import { ipcRenderer as ipc } from 'electron'
import { Component, Vue } from 'vue-property-decorator'
import { Actions, Events } from '../../common/events'
import { AccountType } from '../../common/models/AccountType'
import ConnectAccountButtonComponent from '../components/ConnectAccountButton.vue'
import TextRowComponent from '../components/TextRow.vue'
import { RouteNames } from '../router'
import { AccountModule } from '../store'

@Component({
  components: {
    'account-row': TextRowComponent,
    'connect': ConnectAccountButtonComponent
  }
})
export default class AccountComponent extends Vue {

  public loading = false

  mounted() {
    this.loading = false
  }

  get isConnectedToBitbucketCloud(): boolean {
    return AccountModule.isConnectedToBitbucketCloud
  }

  get isConnectedToCircleCI(): boolean {
    return AccountModule.isConnectedToCircleCI
  }

  get isConnectedToGithub(): boolean {
    return AccountModule.isConnectedToGithub
  }

  public async login(accountType: AccountType) {
    this.loading = true
    console.log(`login: ${accountType}`)
    switch (accountType) {
      case 'bitbucket-cloud':
        Actions.startAuthFlow(accountType)
        break
      case 'github':
        await this.$router.push({name: RouteNames.GITHUB_CHOICE})
        break
      case 'circleci':
        await this.$router.push({name: RouteNames.CIRCLECI_TOKEN})
        break
      default:
        this.loading = false
        throw new Error('Unknown accountType: ' + accountType)
    }
    this.loading = false
  }

  public async logout(accountType: AccountType) {
    console.log(`logout: ${accountType}`)
    ipc.send(Events.START_LOGOUT_FLOW, {accountType})
  }
}
</script>

