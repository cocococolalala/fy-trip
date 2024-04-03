<template>
  <div class="house">
    <div class="house-list" v-if="favorHistory != ''" v-for="(item, index) in favorHistory" :key="index">
      <img class="house-img" :src="item?.pictureList[0]" />
      <!-- 推荐评分 -->
      <div class="msg-tip">
        <b>{{ item?.commentBriefForCD?.overall }}分</b>
        <span class="text">{{ item?.commentBriefForCD?.scoreTitle != undefined ? item?.commentBriefForCD?.scoreTitle : '超赞' }}</span>
      </div>
      <!-- 头像小心心 -->
      <div class="tool-bar">
        <img class="avatar" :src="item?.logoUrl" alt="" />
        <div><img class="love" src="@/assets/img/favor/小心心.png" alt="" /></div>
        <div class="message">
          <img src="@/assets/img/favor/message.png" alt="" />
          <span>{{ item.commentBriefForCD.totalCount }}</span>
        </div>
      </div>
      <!-- 地段 -->
      <div class="info">
        <span class="tag">{{ item?.address }}</span>
        <span class="name">{{ item.unitSummeries[0].text }}·</span>
        <span class="desp">{{ item.unitSummeries[1].text }}</span>
      </div>
      <!-- 酒店名称 -->
      <div class="title">
        {{ item.unitName }}
      </div>
      <!-- 会员区域 -->
      <div class="tags">
        <span class="vip" v-for="txt in item.houseTags">{{ txt.text }}</span>
      </div>
      <!-- 价格区域 -->
      <div class="price">
        <span class="new">￥{{ item.finalPrice }}</span>
        <del class="old">￥{{ item.productPrice }}</del>
        <span class="icon" v-if="item.priceTipBadge?.text">
          <van-icon name="volume" size="10" />
          {{ item.priceTipBadge?.text }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import useSearchStore from '@/stores/modules/search'

const searchStore = useSearchStore()
const { searchResult: favorHistory } = storeToRefs(searchStore)
</script>

<style scoped lang="less">
.house {
  box-sizing: border-box;
  background-color: #f7f8fb;
  padding: 0 20px;
  .house-list {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .house-img {
      width: 100%;
      border-radius: 6px;
    }
    .msg-tip {
      position: relative;
      bottom: 30px;
      left: 10px;
      width: 65px;
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      height: 17px;
      padding-left: 6px;
      padding-right: 6px;
      border-radius: 10px;
      background-color: #e7e7e7;
      b {
        font-size: 12px;
        flex: 1;
        text-align: center;
      }
      .text {
        border-left: 1px solid #666;
        font-size: 12px;
        padding-left: 5px;
        color: #666666;
      }
    }
    .tool-bar {
      position: absolute;
      height: 140px;
      top: 15px;
      right: 10px;
      width: 40px;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-top: 5px;
      }
      .love {
        width: 30px;
      }
      .message {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #fff;
        img {
          width: 30px;
        }
      }
    }
    .info {
      display: flex;
      align-items: center;
      font-size: 12px;
      line-height: 15px;
      flex-wrap: nowrap;
      .tag {
        font-size: 12px;
        color: rgb(255, 255, 255);
        background: rgb(63, 73, 84);
        padding: 0 4px;
        border-radius: 2px;
      }
      .name {
        white-space: nowrap;
        margin-left: 8px;
        margin-right: 8px;
        color: #666;
      }
      .desp {
        font-size: 12px;
        white-space: nowrap;
        color: #666;
      }
    }
    .title {
      line-height: 22px;
      font-size: 18px;
      margin-top: 8px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .vip {
      margin-right: 6px;
      padding: 0 4px;
      font-size: 12px;
      color: rgb(255, 102, 102);
      background: rgba(255, 102, 102, 0.1);
    }
    .price {
      margin-top: 3px;
      margin-bottom: 7px;
      .new {
        position: relative;
        top: 1px;
        color: #ff9645;
        font-size: 20px;
        padding-right: 10px;
        padding-left: 1px;
      }
      .old {
        font-weight: 500;
        font-size: 12px;
        color: #999;
        text-decoration: line-through;
        padding-right: 5px;
      }
      .icon {
        padding: 0.5px 3px;
        font-size: 12px;
        color: rgb(255, 255, 255);
        background: rgb(251, 74, 74);
        border-radius: 5.2px;
        font-size: 12px;
        transform: scale(0.9);
      }
    }
  }
}
</style>
