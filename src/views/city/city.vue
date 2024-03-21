<template>
  <div class="city">
   <!--搜索框-->
   <van-search 
   v-model="searchValue" 
   placeholder="城市/区域/位置" 
   shape="round"
   show-action
   @cancel="cancelClick"
   
   />
   
   
    <van-tabs v-model:active="tabActivate"
    color="#ff9854" >
  <van-tab title="国内·港澳台"></van-tab>
  <van-tab title="海外"></van-tab>
</van-tabs>
 
   






  </div>
</template>

<script setup>
 import { ref } from "vue";
 import { useRouter } from "vue-router";
 import { getCityAll } from "@/services";
 const router = useRouter()


 //搜索框功能
const searchValue = ref("")
function cancelClick() {
router.back()
}

//tab切换的功能
const tabActivate =ref()

//网络请求:请求城市的数据
getCityAll().then(res => {

})

</script>

<style lang="less" scoped>



</style>
