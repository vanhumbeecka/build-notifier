<template>
  <el-menu :default-active="activeIndex" class="bn-menu" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1">Builds</el-menu-item>
    <el-menu-item index="2">Projects</el-menu-item>
    <el-menu-item index="3">Accounts</el-menu-item>
  </el-menu>
</template>
<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {AppModule} from '../store'

  @Component({})
  export default class MenuComponent extends Vue {

    get activeIndex(): string {
      const tabView = AppModule.currentTabView
      switch (tabView) {
        case 'account':
          return '3'
        case 'project':
          return '2'
        case 'build':
        default:
          return '1'
      }
    }

    public handleSelect(index: any, keyPath: any) {
      switch (index) {
        case '3':
          AppModule.setTabView('account')
          break
        case '2':
          AppModule.setTabView('project')
          break
        case '1':
        default:
          AppModule.setTabView('build')
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
