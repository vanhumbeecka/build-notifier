<template>
  <el-main>
    <el-row class="bn-vertical-spacing">
      <el-alert
          style="margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);"
          type="info"
          :closable="false"
          effect="light">
        <div slot="title">
          Choose if you want to only allow your public repositories to be accessed, or both public and private repositories
        </div>
      </el-alert>

    </el-row>
    <el-row class="bn-vertical-spacing">
      <el-button class="btn-block" size="mini" type="primary" @click="handlePublicOnly">
        Public repositories only
      </el-button>
    </el-row>
    <el-row class="bn-vertical-spacing">
      <el-button class="btn-block" size="mini" type="primary" @click="handlePublicAndPrivate">
        Public & private repositories
      </el-button>
    </el-row>
  </el-main>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Actions } from '../../common/events'

@Component({})
export default class TokenGithubComponent extends Vue {

  public handlePublicOnly(): void {
    Actions.startAuthFlow('github')
    this.$router.back()
  }

  public handlePublicAndPrivate(): void {
    Actions.startAuthFlow('github', undefined, {private: true})
    this.$router.back()
  }

}
</script>

