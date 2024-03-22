<template>
  <div class="city-group">
    <van-index-bar :index-list="indexList">
      <van-index-anchor index="热门" />
      <div class="list">
        <template v-for="(city , index) in groupData?.hotCities" :key="index">
        <div class="city" @click="cityClick(city)">{{ city.cityName }}</div>
      </template>
  </div>
     
      <template v-for="(group , index) in groupData?.cities" :key="index">
      <div class="group-item">
        <van-index-anchor :index="group.group" />
       
          <template v-for=" (city , indey) in group.cities" :key="indey">
            <!-- <div class="city">
              {{ city.cityName }}
            </div> -->
            <van-cell :title="city. cityName" @click="cityClick(city)"/>
           </template>
        
      </div>
    </template>
    </van-index-bar>
  </div>
</template>

<script setup>

import useCityStore from "@/stores/modules/city";
import { computed } from "vue";
import { useRouter } from "vue-router";

//定义props
const props = defineProps({
  groupData :{
    type: Object,
  default: () => {

  }
  }
  
})

//动态获取索引
const indexList = computed(() => {
  const list = props.groupData.cities.map(item => item.group)
  list.unshift("#")
  return list
})

//监听城市的点击
const router = useRouter()
const cityStore = useCityStore()
const cityClick = (city) => {

  //选中当前城市
  console.log(city)
  cityStore.currentCity = city

  //返回上一级
  router.back()
  }

  


</script>


<style lang="less" scoped>

.list{
  
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 10px;
  padding-right: 25px;

  .city{
    width: 70px;
    height: 28px;
    border-radius: 14px;
    font-size: 12px;
    color: #000;
    background-color: #fff4ec;
    text-align: center;
    line-height: 28px;
    margin: 6px 0;
  }
  
}
</style>
