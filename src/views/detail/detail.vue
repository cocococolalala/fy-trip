<template>
  <div class="detail top-page" ref="detailRef">
    <TabControl 
    :titles="names"
    v-if="showTabControl"
    class="tabs"
    @tabItemClick="tabClick"
    ref="tabControlRef"

    />


  <van-nav-bar
  title="房屋详情"
  left-text="旅途"
  left-arrow
  @click-left="onClickLeft"
/>

<div class="main" v-if="mainPart" v-memo="[mainPart]">
  <DetailSwipe :swipe-data="mainPart.topModule.housePicture.housePics" />

  <detailInfos  name="描述"
:ref="getSectionRef"
:top-infos="mainPart.topModule" />

<DetailFacility name="设施"
:ref="getSectionRef"
:house-facility="mainPart.dynamicModule.facilityModule.houseFacility"/>

<DetailLandlord name="房东"
:ref="getSectionRef"
:landlord="mainPart.dynamicModule.landlordModule"/>

<DetailComment name="评论"
:ref="getSectionRef"
:comment="mainPart.dynamicModule.commentModule" />

<DetailNotice name="须知"
:ref="getSectionRef"
:order-rules="mainPart.dynamicModule.rulesModule.orderRules" />

<DetailMap name="周边"
:ref="getSectionRef"
:position="mainPart.dynamicModule.positionModule" />

<DetailIntro :price-intro="mainPart.introductionModule" />


</div>
   


  <div class="footer">
    <img src="@/assets/img/detail/icon_ensure.png">
    <div class="text">房源旅途,永无止境!</div>
  </div>
  </div>
</template>

<script setup>

import { ref,computed, watch } from "vue";
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

import useScroll from '@/hooks/useScroll'


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

const onClickLeft = () => {
  router.back()

}

//tabcontrol相关操作
const detailRef = ref()
const { scrollTop } = useScroll(detailRef)
const showTabControl = computed(() => {
  return scrollTop.value >= 300
  
})

const sectionEls = ref({})
const names = computed(() => {
  return Object.keys(sectionEls.value)
})

const getSectionRef = (value) => {
  if(!value) return
  const name = value.$el.getAttribute("name")
  sectionEls.value[name] = value.$el
}


const tabClick = (index) => {
  const key = Object.keys(sectionEls.value)[index]
  const el = sectionEls.value[key]
  
  

  detailRef.value.scrollTo({
    top: el.offsetTop - 44,
    behavior: "smooth"
  })
}

//页面滚动,滚动时匹配tabControl的index
const tabControlRef = ref()
watch(scrollTop, (newValue) => {

  

  //1.获取所有区域的offsetTop
  const els = Object.values(sectionEls.value)
  const values = els.map(el => el.offsetTop)
  
  //根据newValue去匹配想要的索引
  let index = values.length - 1
 for (let i = 0; i < values.length; i++) {
  
  if(values[i] > newValue + 44){
    index = i -1
    break
  }
 }

 tabControlRef.value?.setCurrentIndex(index)
})


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
