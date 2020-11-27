<template>
  <div>
    <bn-menu></bn-menu>
    <transition name="component-fade" mode="out-in">
      <component v-bind:is="currentTabComponent"></component>
    </transition>
  </div>
</template>
<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import MenuComponent from '../components/Menu.vue'
  import {AppModule} from '../store'
  import AccountComponent from './Account.vue'
  import BuildComponent from './Build.vue'
  import ProjectComponent from './Project.vue'

  @Component({
    components: {
      "bn-menu": MenuComponent,
      build: BuildComponent,
      project: ProjectComponent,
      account: AccountComponent
    }
  })
  export default class HomeComponent extends Vue {

    mounted() {
      // ManageModule.refreshAllBuilds()
    }

    get currentTabComponent(): 'build' | 'project' | 'account' {
      return AppModule.currentTabView
    }
  }
</script>
<style>
  .component-fade-enter-active, .component-fade-leave-active {
    transition: all .2s ease;
  }
  .component-fade-enter, .component-fade-leave-to {
    opacity: 0;
  }
</style>
