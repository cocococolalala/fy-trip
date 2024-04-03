<template>
  <div class="search">
    <div class="city">{{ city }}</div>
    <div class="select-time">
      <div class="start item">
        <div class="name">住</div>
        <div class="date">{{ startDateStr }}</div>
      </div>
      
      <div class="end item">
        <div class="name">离</div>
        <div class="date">{{ endDateStr }}</div>
      </div>
    </div>

    <div class="content">
      <div class="keyword">
        搜索博尔塔拉的景点、地标、房源
      </div>
    </div>
  </div>
</template>

<script setup>
import useMainStore from '@/stores/modules/main';
import { storeToRefs } from 'pinia';
import { formatMonthDay } from '@/utils/format_date'
import { computed } from 'vue';


defineProps({
  city: {
    type: String,
    default: () =>'广州',
  }
})

const mainStore = useMainStore()
const {startDate, endDate} = storeToRefs(mainStore)

const startDateStr = computed(() => formatMonthDay(startDate.value,'MM.DD'))
const endDateStr = computed(() => formatMonthDay(endDate.value,'MM.DD'))
</script>


<style lang="less" scoped>

.search {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 38px;
  line-height: 38px;
  padding: 0 10px;
  font-size: 14px;
  color: #999;
  border-radius: 6px;
  background: #f2f4f6;
 
  

  .city
   {
    font-weight: 500;
    min-width: 30px;
    font-size: 14px;
    padding-right: 6px;
    margin-right: 5px;
    border-right: 1px solid #fff;
    color: #333;
    white-space: nowrap;
  }

  .select-time {
    display: flex;
    flex-direction: column;
    .item {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      line-height: normal;
      font-size: 10px;
      .name {
        font-size: 10px;
      }

      .date {
        position: relative;
        color: #333;
        margin: 0 10px 0 3px;
        font-weight: 500;
      }
    }

    .end .date::after {
      content: ' ';
      width: 0;
      height: 0;
      border: 4px solid #666;
      border-color: rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) #666;
      -webkit-border-radius: 3px;
      border-radius: 3px;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
      position: absolute;
      bottom: 0px;
      right: -12px;
    }
  }

  .content {
    position: relative;
    flex: 1;
    padding: 0 6px;
    text-align: left;
    border-left: 1px solid #fff;
    .keyword {
      max-width: 155px;
      font-size: 12px;
      overflow: hidden;
      word-wrap: normal;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
