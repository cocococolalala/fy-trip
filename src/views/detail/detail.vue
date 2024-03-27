<template>
  <div class="detail top-page">
    <TabControl 
    :titles="['v','a']"
    v-if="showTabControl"
    class="tabs"

    />


    <van-nav-bar
  title="房屋详情"
  left-text="旅途"
  left-arrow
  @click-left="onClickLeft"
/>
<div class="main" v-if="mainPart">
  <DetailSwipe :swipe-data="mainPart.topModule.housePicture.housePics" />
</div>
   
<detailInfos :top-infos="mainPart.topModule" />

<DetailFacility :house-facility="mainPart.dynamicModule.facilityModule.houseFacility"/>

<DetailLandlord :landlord="mainPart.dynamicModule.landlordModule"/>

<DetailComment :comment="mainPart.dynamicModule.commentModule" />

<DetailNotice :order-rules="mainPart.dynamicModule.rulesModule.orderRules" />

<DetailMap />
<DetailIntro :price-intro="mainPart.introductionModule" />


  <div class="footer">
    <img src="@/assets/img/detail/icon_ensure.png">
    <div class="text">房源旅途,永无止境!</div>
  </div>
  </div>
</template>

<script setup>

import { ref,computed } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { getDetailInfos } from "@/services";

import TabControl from "@/components/tab-control/tabControl.vue";

import DetailSwipe from "./cpns/detail-01-swipe.vue";
import DetailInfos from "./cpns/detail-02-infos.vue";
import DetailFacility from "./cpns/detail-03-facility.vue";
import DetailLandlord from "./cpns/detail-04-landlord.vue";
import DetailComment from "./cpns/detail-05-comment.vue";
import DetailNotice from "./cpns/detail-06-notice.vue";
import DetailMap from "./cpns/detail-07-map.vue";
import DetailIntro from "./cpns/detail-08-intro.vue";



const router = useRouter()
const route = useRoute()
const houseId = route.params.id

//发送网络请求获取数据
const detailInfos = ref({})
const mainPart = computed(() => detailInfos.value.mainPart)
getDetailInfos(houseId).then(res => {
  detailInfos.value = res.data
})



//监听返回按钮的点击

const  onClickLeft = () => {
  router.back()

}

//tabcontrol相关操作


</script>


<style lang="less" scoped>

.tabs{
  position: fixed;
  z-index: 9;
  left: 0;
  right: 0;
  top: 0;
  background-color: #fff;
}
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;

  img{
    width: 123px;

  }

  .text {
    margin-top: 12px;
    font-size: 12px;
    color: #7688a7;
  }
}
</style>
