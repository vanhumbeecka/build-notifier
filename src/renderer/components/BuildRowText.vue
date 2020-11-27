<template>
    <span>
        <div class="bn-highlight bn-no-overflow">
            {{repositoryBuilds.repository.name}}
        </div>
        <div :key="`${selectedBuild.id}-fromnow`" class="bn-subtext bn-flex-horizontal">
            <font-awesome-icon icon="calendar" fixed-width></font-awesome-icon>
            &nbsp;{{selectedBuildFromNow}}
        </div>
        <div :key="selectedBuild.id" class="bn-subtext bn-flex-horizontal bn-no-overflow">
            <font-awesome-icon v-if="selectedBuild.refType === 'branch'" icon="code-branch"
                               fixed-width></font-awesome-icon>
            <font-awesome-icon v-else-if="selectedBuild.refType === 'tag'" icon="tag"
                               fixed-width></font-awesome-icon>
            &nbsp;{{selectedBuild.branchOrTagName}}
        </div>
    </span>
</template>
<script lang="ts">
  import moment from 'moment'
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { Build } from '../store/models/build'
  import { DataBar } from '../store/models/data-bar'
  import { RepositoryBuilds } from '../store/models/repository-builds'

  @Component({})
  export default class BuildRowTextComponent extends Vue {

    @Prop({required: true}) public repositoryBuilds!: RepositoryBuilds
    @Prop({required: true}) public activeDataBar!: DataBar
    @Prop() public activeRepositoryId!: string

    get selectedBuild(): Build {
      const lastBuild = this.repositoryBuilds.builds[this.repositoryBuilds.builds.length - 1]

      // if (this.repositoryBuilds.repository.id !== this.activeRepositoryId) {
      //   return lastBuild
      // }
      //
      // if (isEmptyDataBar(this.activeDataBar)) {
      //   return lastBuild
      // }
      //
      // if (!this.activeDataBar.build) {
      //   return lastBuild
      // }
      //
      // return this.activeDataBar.build

      return lastBuild
    }

    get selectedBuildFromNow() {
      return moment(this.selectedBuild.createdOn).fromNow()
    }
  }
</script>

