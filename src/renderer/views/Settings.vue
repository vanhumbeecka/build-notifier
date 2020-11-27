<template>
  <el-container direction="vertical">
    <bn-settings-menu></bn-settings-menu>
    <transition name="settings-component-fade" mode="out-in">
      <component v-bind:is="currentTabComponent"></component>
    </transition>
    <bn-footer></bn-footer>
  </el-container>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import FooterComponent from '../components/Footer.vue'
import MenuSettingsComponent from '../components/MenuSettings.vue'
import { AppModule } from '../store'
import SettingsGeneralComponent from './SettingsGeneral.vue'
import SettingsLayoutComponent from './SettingsLayout.vue'

@Component({
  components: {
    "bn-settings-menu": MenuSettingsComponent,
    'bn-footer': FooterComponent,
    general: SettingsGeneralComponent,
    layout: SettingsLayoutComponent
  }
})
export default class SettingsComponent extends Vue {

  get currentTabComponent(): 'general' | 'layout' {
    return AppModule.currentSettingsTabView
  }
}
</script>
<style>
.settings-component-fade-enter-active, .settings-component-fade-leave-active {
  transition: all .2s ease;
}
.settings-component-fade-enter, .settings-component-fade-leave-to {
  opacity: 0;
}
</style>
