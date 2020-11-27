<template>
    <el-header class="bn-header">
      <h1 class="bn-title">
      <span v-if="showBackButton" @click="goBack()" class="bn-button bn-back-button">
          <i class="el-icon-back"></i>
      </span>
        {{title}}
        <span class="flex-item"></span>
        <span @click="toSettingsPage()" v-show="!isSettingsPage" class="bn-button">
          <i class="el-icon-s-tools"></i>
      </span>
      </h1>
    </el-header>

</template>
<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import {RouteNames} from '../router'
  import {AppModule} from '../store'

  @Component
  export default class HeaderComponent extends Vue {

    public toSettingsPage() {
      this.$router.push({name: RouteNames.SETTINGS})
    }

    get isSettingsPage(): boolean {
      return this.$route.name === RouteNames.SETTINGS
    }

    get showBackButton(): boolean {
      return AppModule.backButtonVisible
    }

    get title(): string {
      return this.$route.meta?.title || this.$route.name || ''
    }

    public handleClick(tab: string, event: any) {
      console.log(tab, event)
    }

    public goBack() {
      this.$router.back()
    }
  }
</script>
<style lang="scss">
  .bn-back-button {
    margin-right: 10px;
  }

  .bn-header {
    background-color: black;
    color: white;
  }
</style>
