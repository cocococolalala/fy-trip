<template>
  <div class="content">
    <div class="content">
      <h2 class="title">热门精选</h2>
      <div class="list">
        <template v-for="(item,index) in houseList" :key="item.data.houseId">
          <template v-if="item.discoveryContentType === 9">
            <HouseItemV9 :item-data="item.data"
            @click="itemClick(item.data)"/>
            </template>
            <template v-else-if="item.discoveryContentType === 3">
              <HouseItemV3 :item-data="item.data"
              @click="itemClick(item.data)"/>
            </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import useHomeStore from '@/stores/modules/home';
import { storeToRefs } from 'pinia';
import HouseItemV9 from "@/components/house-item-v9/house-item-v9.vue";
import HouseItemV3 from "@/components/house-item-v3/house-item-v3.vue";
import { useRouter } from 'vue-router';


const homeStore = useHomeStore()
const {houseList} = storeToRefs(homeStore)


const router =useRouter()
const itemClick = (item) => {
  //跳转到详情页
  router.push("/detail/" + item.houseId)

}

</script>

<style lang="less" scoped>


.content{
  padding: 10px 8px;
  .title {
    font-size: 22px;
    padding: 10px;
  }

  .list {
    display: flex;
    flex-wrap: wrap;

  }
}
</style>
