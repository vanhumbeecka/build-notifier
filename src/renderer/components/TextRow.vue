<template>
  <el-row type="flex" justify="space-between" align="middle" class="bn-row-style">
    <slot></slot>
    <slot name="right"></slot>
  </el-row>
</template>
<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  @Component({})
  export default class TextRowComponent extends Vue {

  }
</script>
<style>
  .bn-row-style{
    height: 50px;
  }
</style>
