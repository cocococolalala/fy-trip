<template>
  <div class="search">
    <!-- 导航栏 -->
    <van-nav-bar left-arrow @click-left="onClickLeft" class="nav-bar">
      <template #right>
        <img src="@/assets/img/home/icon-right-menu.png" width="20" height="15" />
      </template>
      <template #title>
        <searchBar :city="cityStore.currentCity.cityName" @click="goCity" />
      </template>
    </van-nav-bar>
    <!-- 下拉菜单 -->
    <van-dropdown-menu>
      <van-dropdown-item :title="searchList[0]?.label" ref="Menu1">
        <van-tree-select v-model:active-id="activeId" v-model:main-active-index="activeIndex" :items="consequence3[0]" />
        <div class="view-house-btns bottom">
          <div class="clear">清空</div>
          <div class="view-house" @click="close">查看房屋(220套)</div>
        </div>
      </van-dropdown-item>
      <van-dropdown-item :title="searchList[1]?.label" :options="processing3" v-model="processing3.value" />

      <van-dropdown-item :title="searchList[2]?.label" ref="Menu2">
        <van-tree-select v-model:active-id="activeId" v-model:main-active-index="activeIndex" :items="consequence3[1]" />
        <div class="view-house-btns bottom">
          <div class="clear">清空</div>
          <div class="view-house" @click="close">查看房屋(220套)</div>
        </div>
      </van-dropdown-item>
    </van-dropdown-menu>

    <!-- 分类选择 -->
    <div class="tab-wrapper">
      <div class="tab-select">
        <van-dropdown-menu active-color="#ff9854" @click="active = -1">
          <van-dropdown-item title="优惠" ref="Menu3">
            <div class="tab-content">
              <span :class="active2 == index ? 'active' : ''" @click="active2 = index" v-for="(item, index) in discounts">{{ item }}</span>
            </div>
            <div class="view-house-btns">
              <div class="clear">清空</div>
              <div class="view-house" @click="close">查看房屋(220套)</div>
            </div>
          </van-dropdown-item>
        </van-dropdown-menu>
        <span class="tab-span" :class="active == index ? 'active' : ''" @click="active = index" v-for="(item, index) in simulation">{{ item }}</span>
      </div>
    </div>

    <!-- 搜索内容 -->
    <searcRecommend />
  </div>
</template>
<script setup>
// import useMainStore from '@/stores/modules/main'

import useCityStore from '@/stores/modules/city';
import useSearchStore from '@/stores/modules/search'
import { storeToRefs } from 'pinia'
// import { formatMonthDay } from '@/utils/format_date'
import { computed, ref, watch } from 'vue'
import router from '@/router'
import searchBar from './cpns/search-bar.vue'

import searcRecommend from './cpns/search-recommend.vue'
const onClickLeft = () => {
  router.back()
}

const cityStore = useCityStore() 


const SearchStore = useSearchStore()
const { searchList } = storeToRefs(SearchStore)
// 发起搜索顶部请求
SearchStore.fetchSearchTopData()
SearchStore.fetchSearchResultData()

const resolve = ref([])
const popularity = ref([])

const processing3 = ref([])
const consequence3 = ref([])
watch(searchList, (newVal) => {
  for (const item of newVal) {
    if (item.subGroups.length != 0) {
      resolve.value.push(item.subGroups)
    }
    if (item.items.length != 0) {
      popularity.value.push(item.items)
    }
  }
  reconsitution()
  reconsitution2()
})
// 重构数据
function reconsitution() {
  for (let i = 0; i < resolve.value.length; i++) {
    consequence3.value.push([])
    consequence3.value[i].text = resolve.value[i][0].label
    for (let j = 0; j < resolve.value[i].length; j++) {
      consequence3.value[i].push({ text: resolve.value[i][j].label, children: [] })

      for (let k = 0; k < resolve.value[i][j].items.length; k++) {
        consequence3.value[i][j].children.push({
          text: resolve.value[i][j].items[k].label,
          id: resolve.value[i][j].items[k].value,
          text2: resolve.value[i][j].items[k].percentageUser,
        })
      }
    }
  }
  for (let index = 0; index < consequence3.value.length; index++) {
    for (let index2 = 0; index2 < consequence3.value[index].length; index2++) {
      if (consequence3.value[index][index2].children.length == 0) {
        consequence3.value[index][index2].children.push({ text: `${consequence3.value[index][index2].text}暂时还没有数据哦~` })
      }
    }
  }
}
function reconsitution2() {
  for (const item of popularity.value[0]) {
    processing3.value.push({
      text: item.label,
      value: item.value,
    })
  }
  // localStorage.setItem('processing', JSON.stringify(processing3.value))
}

const activeId = ref(1)
const activeIndex = ref(0)

// 点击关闭
const Menu1 = ref()
const Menu2 = ref()
const Menu3 = ref()
const close = () => {
  Menu1.value.toggle(false)
  Menu2.value.toggle(false)
  Menu3.value.toggle(false)
}
// 模拟数据
const active = ref(0)
const active2 = ref(0)
const simulation = ['多人入住', '复试loft', '近地铁', '别墅', '投影设备', '酒店式公寓', '可做饭', '金牌民宿', '麻将机', '可带宠物']
const discounts = ['精品优惠', '新房特惠', '早订优惠', '天天特惠', '房东直降']

// 路由跳转
const goCity = ()=>{
  router.push('/city')
}
</script>

<style lang="less">
.search {
  .nav-bar {
    box-sizing: border-box;
    padding: 5px 0;
  }
  .view-house-btns {
    display: flex;
    align-items: center;
    height: 60px;
    background-color: #fff;
    .clear {
      display: inline-block;
      margin-left: 20px;
      width: 85px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: #f3f4f6;
      border-radius: 20px;
      font-size: 15px;
      color: #dadada;
    }
    .view-house {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 240px;
      height: 40px;
      margin-left: 10px;
      border-radius: 20px;
      font-size: 15px;
      color: #fff;
      background: var(--primary-color);
    }
  }
  .bottom {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }
  .active {
    color: #ff9854;
  }
  .tab-wrapper {
    display: flex;
    background-color: #f7f8fb;
    padding: 10px 0;

    .wrapper {
      font-size: 12px;
    }
    .tab-select {
      overflow: auto;
      box-sizing: border-box;
      flex-shrink: 0;
      width: calc(100vw);
      padding: 0 10px;
      display: flex;
      align-items: center;
      font-size: 12px;
      &::-webkit-scrollbar {
        display: none;
      }
      .van-dropdown-item {
        top: 152.636px !important;
      }
      .tab-content {
        display: flex;
        flex-shrink: 0;
        width: 100%;
        flex-wrap: wrap;
        // background-color: #f6f7fa;
        align-items: center;
        span {
          width: 25%;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 20px;
          text-align: center;
          margin: 10px;
          height: 30px;
          background-color: #f6f7fa;
        }
      }
      .van-dropdown-menu {
        --van-dropdown-menu-height: 30px !important;
        .van-dropdown-menu__bar {
          border-radius: 20px !important;
          margin-right: 10px !important;
        }
        .van-dropdown-menu__title {
          font-size: 12px !important;
          width: 68px !important;
          text-align: center;
        }
        .van-dropdown-menu__title:after {
          right: 2.5vw !important;
        }
      }
      .tab-span {
        height: 30px;
        display: flex;
        flex-shrink: 0;
        width: 68px;
        margin-right: 10px;
        justify-content: center;
        align-items: center;
        font-weight: normal;
        border-radius: 20px;
        background-color: #fff;
      }
    }
  }
}
</style>
