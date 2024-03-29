<template>
  <div class="favor-top-page">
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

<!-- 导航栏 -->
<van-tabs v-model:active="tabActivate" color="#ff9854">
  <van-tab title="房屋">
    <FavorList />
  </van-tab>
  <van-tab title="房东">
    <FavorLandLord />
  </van-tab>
</van-tabs>



  </div>
</template>

<script setup>

import FavorList from "./cpns/favor-list.vue";
import FavorLandLord from "./cpns/favor-landlord.vue";
import { useRouter } from 'vue-router';


const router = useRouter()
const onClickLeft = () =>{
  router.back()
}



</script>

<style lang="less" scoped>
</style>
