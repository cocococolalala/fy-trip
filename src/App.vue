<template>
  <div class="app">
    <router-view></router-view>
    <tab-Bar v-if="!route.meta.hideTabBar"/>
    
  </div>
</template>

<script setup>

import tabBar from "./components/tab-bar/tab-bar.vue"
import { useRoute } from "vue-router";

const route = useRoute()

</script>

<style lang="=less" scoped>
</style>

