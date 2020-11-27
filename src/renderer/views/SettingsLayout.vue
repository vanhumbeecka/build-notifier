<template>
  <el-main>
    <div class="bn-flex-vertical">
      <settings-row>
        <template v-slot>Sort builds</template>
        <template v-slot:right>
          <el-select size="mini" v-model="order" placeholder="Order by">
            <el-option
                v-for="item in buildOrderOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </template>
      </settings-row>
    </div>
  </el-main>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import TextRowComponent from '../components/TextRow.vue'
import { AppModule } from '../store'
import { OrderType } from '../store/models/order'

@Component({
  components: {
    'settings-row': TextRowComponent
  }
})
export default class SettingsLayoutComponent extends Vue {

  buildOrderOptions: Array<{value: OrderType, label: string}> = [
    {
      label: "Alphabetically",
      value: 'alphabetically'
    }, {
      label: "Most recent",
      value: "most-recent"
    }
  ]

  get order(): OrderType {
    return AppModule.buildOrder
  }

  set order(orderType: OrderType) {
    AppModule.setBuildOrderType(orderType)
  }
}
</script>
