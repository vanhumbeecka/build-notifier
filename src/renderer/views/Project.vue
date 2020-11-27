<template>
  <el-main>
    <el-row class="bn-vertical-spacing">
      <el-input
          style="margin-bottom: 10px;"
          placeholder="Repository name"
          v-model="search"
          size="mini"
          type="text"
          @input="debounceSearch">
        <i
            class="el-icon-search el-input__icon"
            slot="prefix"
            v-show="!searching">
        </i>
        <i
            class="el-icon-loading el-input__icon"
            slot="prefix"
            v-show="searching">
        </i>
      </el-input>
      <el-select style="width: 100%;"
                  size="mini"
                 v-model="selectedAccounts" multiple placeholder="Filter on accounts">
        <el-option
            v-for="item in connectedAccounts"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
    </el-row>

    <el-row v-for="p in selectedProjects" :key="p.id" class="bn-flex-horizontal">
      <el-checkbox :label="p.id" :key="p.id" @change="changed" :value="true">{{p.name}}</el-checkbox>
      <span class="flex-item"></span>
      <el-tag size="mini" type="info">{{p.accountType}}</el-tag>
    </el-row>
    <el-divider></el-divider>
    <el-row v-for="p in unselectedProjects" :key="p.id" class="bn-flex-horizontal">
      <el-checkbox :label="p.id" :key="p.id" @change="changed" :value="false">{{p.name}}</el-checkbox>
      <span class="flex-item"></span>
      <el-tag size="mini" type="info">{{p.accountType}}</el-tag>
    </el-row>
  </el-main>

</template>
<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import { AccountType } from '../../common/models/AccountType'
  import { AccountModule, ManageModule } from '../store'
  import {Repository} from '../store/models/repository'

  @Component({
    name: 'project'
  })
  export default class ProjectComponent extends Vue {

    public search = ''
    private debounce: number | undefined;
    public searching = false;
    public selectedAccounts: AccountType[] = []

    mounted() {
      this.search = ''
      this.selectedAccounts = this.connectedAccounts
      this.directSearch()
    }

    get connectedAccounts() {
      return AccountModule.connectedAccounts
    }

    public directSearch() {
      this.searching = true
      ManageModule.searchProjects({search: this.search, accountTypes: this.selectedAccounts})
        .finally(() => this.searching = false)
    }

    public debounceSearch(event: Event) {
      this.searching = true
      if (this.debounce) {
        clearTimeout(this.debounce)
      }
      this.debounce = window.setTimeout(() => {
        ManageModule.searchProjects({search: this.search, accountTypes: this.selectedAccounts})
            .finally(() => this.searching = false)
      }, 600)
    }

    public changed(val: any, event: any) {
      const id = event.target.value
      if (val) {
        ManageModule.setProjectToSelected(id)
      } else {
        ManageModule.setProjectToUnselected(id)
      }
    }

    get selectedProjects(): Repository[] {
      const selected = ManageModule.projects.filter(p => p.selected)
      if (ManageModule.projectSearching) {
        return selected.filter(s => ManageModule.projectSearchIds.includes(s.id))
      }
      return selected
    }

    get unselectedProjects(): Repository[] {
      const unselected = ManageModule.projects.filter(p => !p.selected)
      if (ManageModule.projectSearching) {
        return unselected.filter(s => ManageModule.projectSearchIds.includes(s.id))
      }
      return []
    }

  }
</script>
