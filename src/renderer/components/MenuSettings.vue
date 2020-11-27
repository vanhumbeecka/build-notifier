<template>
    <el-menu :default-active="activeIndex" class="bn-menu" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">General</el-menu-item>
        <el-menu-item index="2">Layout</el-menu-item>
    </el-menu>
</template>
<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import { AppModule } from '../store'

  @Component({})
  export default class MenuSettingsComponent extends Vue {

    get activeIndex(): string {
      const tabView = AppModule.currentSettingsTabView
      switch (tabView) {
        case 'layout':
          return '2'
        case 'general':
        default:
          return '1'
      }
    }

    public handleSelect(index: any, keyPath: any) {
      switch (index) {
        case '2':
          AppModule.setSettingsTabView('layout')
          break
        case '1':
        default:
          AppModule.setSettingsTabView('general')
          break
      }
    }
  }
</script>
<style lang="scss">
    .bn-menu.el-menu {
        .el-menu-item {
            line-height: 40px;
            height: 40px;
        }
    }
</style>
