<template>
  <div class="app">
    <router-view></router-view>
    <tab-Bar v-if="!route.meta.hideTabBar"/>
    <loading/>
    
  </div>
</template>

<script setup>

import tabBar from "./components/tab-bar/tab-bar.vue"
import { useRoute } from "vue-router";
import loading from "./components/loading/loading.vue";

const route = useRoute()

</script>

<style lang="less" scoped>


</style>

