<template>
  <el-footer class="bn-flex-horizontal bn-subtext">
    Version {{ appVersion }}
    <span style="flex: 1"></span>
    <el-button type="text" @click="handleClick">
      <font-awesome-icon icon="globe"></font-awesome-icon>
    </el-button>
    <el-button type="text" @click="handleTwitterClick">
      <font-awesome-icon :icon="['fab', 'twitter']"></font-awesome-icon>
    </el-button>
  </el-footer>
</template>
<script lang="ts">
import { shell } from 'electron'
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { AppModule } from '../store'

@Component({})
export default class FooterComponent extends Vue {

  get appVersion(): string {
    return AppModule.version
  }

  public handleClick() {
    shell.openExternal('https://buildnotifier.app')
  }

  public handleTwitterClick() {
    shell.openExternal('https://twitter.com/buildnotifier')
  }
}
</script>
