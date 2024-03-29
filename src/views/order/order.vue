<template>
  <div class="order-top-page">
    <van-nav-bar 
  title="订单列表"
  left-text="旅途"
  left-arrow
  @click-left="onClickLeft"
>
    <template #right>
        <img src="@/assets/img/home/icon-right-menu.png" width="20" height="15" />
      </template>
</van-nav-bar>

<!-- 导航栏 -->
<van-tabs v-model:active="active" 
@click-tab="onClickTab" title-active-color="#ff9854">
  <van-tab v-for="(item,index) in ['全部订单','最近订单','未完成订单']" :title="item" :key="index">
  <OrderAll />
  </van-tab>
  
</van-tabs>
</div>
</template>


<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue'
import useOrderStore from '@/stores/modules/order'
import OrderAll from "./cpns/order-all.vue";

//监听返回按钮
const router = useRouter()
const onClickLeft = () => {
  router.back()
}

const active = ref(0)

const orderStore = useOrderStore()
orderStore.fetchOrderListData()

const onClickTab = () => {
  orderStore.fetchOrderListData(active.value)
}

</script>

<style lang="less" scoped>

</style>
