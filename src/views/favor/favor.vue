<template>
  <div class="favor">
    <van-nav-bar 
  title="我的收藏"
  left-text="旅途"
  left-arrow
  @click-left="onClickLeft"
>
    <template #right>
        <img src="@/assets/img/home/icon-right-menu.png" width="20" height="15" />
      </template>
</van-nav-bar>

<FavorList />

  </div>
</template>

<script setup>

import FavorList from "./cpns/favor-list.vue";

</script>

<style lang="less" scoped>
</style>
