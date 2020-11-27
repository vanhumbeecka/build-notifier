<template>
  <div>
    <span v-if="isConnectedToAccount">
            <el-button size="mini" type="secondary" @click="logout()"
                       :disabled="loading">Logout</el-button>
        </span>
    <span v-else>
            <el-button size="mini" type="primary" @click="login()"
                       :disabled="loading">Login</el-button>
        </span>
  </div>
</template>
<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class ConnectAccountButtonComponent extends Vue {

  @Prop() isConnectedToAccount!: boolean
  @Prop({default: false}) loading!: boolean

  @Emit('logout-clicked')
  public logout() {
    return
  }

  @Emit('login-clicked')
  public login() {
    return
  }
}
</script>

