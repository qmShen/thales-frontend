<template>
  <el-menu theme="dark" class="el-menu-demo navbar" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1">THALES</el-menu-item>

    <el-submenu index="2">
      <template slot="title">Select Station</template>
      <el-menu-item index="admiralty">admiralty</el-menu-item>
      <el-menu-item index="mongkok">mongkok</el-menu-item>

    </el-submenu>
  </el-menu>
</template>

<script>
  import pipeService from '../service/pipeService.js'
  export default {
    name: 'nav',
    methods:{
      handleSelect(key, keyPath){
        pipeService.emitStationSelected(key);
      }
    }
  }
</script>

<style>
  .navbar{
  }
</style>
