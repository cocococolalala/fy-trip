<template>
  <div class="home">
    <home-nav-bar/>
    <div class="banner">
      <img src="@/assets/img/home/banner.webp" alt="">
    </div>
    <home-search-box />
    <home-categories />

    <div class="search-bar" v-if="isShowSearchBar">
    <search-bar :start-date="'09.19'" :end-date="'09.20'"/>
    </div>
    <home-content />
    <!-- <button @click="moreBtnClick">加载更多</button> -->
  
  </div>
  <div/>
</template>

<script setup>
import { watch } from 'vue';
import { ref } from "vue";
import useHomeStore from '@/stores/modules/home';
import HomeNavBar from './cpns/home-nav-bar.vue'
import searchBar from "@/components/search-bar/search-bar.vue";
import HomeSearchBox from './cpns/home-search-box.vue'
import HomeContent from "./cpns/home-content.vue";
import homeCategories from "./cpns/home-categories.vue";

import useScroll from "@/hooks/useScroll";





// 发送网络请求
const homeStore = useHomeStore()
homeStore.fetchHotSuggestData()
homeStore.fetchCategoriesData()
homeStore.fetchHouseListData()




//监听window窗口的滚动

const { isReachBottom,scrollTop } = useScroll()
watch(isReachBottom,(newValue) => {
  if(newValue) {
    homeStore.fetchHouseListData().then(() => {
      isReachBottom.value = false
    })
  }
})

//搜索框显示的控制
const isShowSearchBar = ref (false)
watch( scrollTop, (newTop) => {
  isShowSearchBar.value = newTop > 360
})



</script>

<style lang="less" scoped>
.home {
  padding-bottom: 100px;
}

.banner {
  img {
    width: 100%;
  }
}

.search-bar {
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
  right: 0;
  height: 45px;
  padding: 16px 16px 10px;
  background-color: #fff;
}

</style>
