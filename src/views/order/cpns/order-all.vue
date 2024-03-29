<template>
  <div class="all">
    <div class="order-item" v-for="(orders, index) in orders" :key="index">
      <div class="order-item-title">
        <div class="name ellipsis-text-1">
          {{ orders?.unitName }}
        </div>
        <div class="status-name">
          {{ orders?.orderStatusDesc }}
        </div>
        </div>

      <div class="order-item-info">
        <img :src="orders?.unitPicture" class="img-bg" />

        <div class="bottom">
          <div class="b-left">
            <div class="date">
              <p class="day">
                {{ startDateStr }}
              </p>
              <div class="week-time">
                <span class="week">{{ '周'+ chineseDay }}</span>
                <span class="time">
                  {{ orders?.checkInLatestTime }}
                </span>
              </div>
            </div>
            <img src="@/assets/img/order/icon_right_orderlist.png" class="arrow" />
            <div class="date">
              <p class="day">
              {{ endDateStr }}
            </p>
            <div class="week-time">
              <span class="week">
                {{ '周'+ nextDate }}
              </span>
              <span class="time">
                {{ orders?.checkOutLatestTime }}
              </span>
            </div>
          </div>
            </div>
            

          <div class="b-right">
            <p class="name">支付总价</p>
            <span class="price">
              ￥ {{ orders?.prepayAmount }}
            </span>
          </div>
        </div>


      </div>

      <div class="order-item-btn">
        <div class="left">
          <div class="left-content">
            <img src="@/assets/img/order/icon-time.png" class="icon-time" />
            <span class="time">{{ Down }}分钟</span>
            <span class="msg">{{ orders?.summary }}</span>
          </div>
        </div>

        <div class="right">
          <button class="btn connect">联系房东</button>
          <button class="btn pay">去支付</button>
        </div>



      </div>


      </div>
    </div>

</template>

<script setup>
import useMainStore from '@/stores/modules/main';
import useOrderStore from '@/stores/modules/order';
import { formatMonthDay } from '@/utils/format_date';
import { storeToRefs } from 'pinia';
import { computed,ref } from 'vue';


const orderStore = useOrderStore()
const {orderList : orders} = storeToRefs(orderStore)

//日期
const mainStore = useMainStore()
const{ startDate , endDate } = storeToRefs(mainStore)
const startDateStr = computed( () => 
  formatMonthDay(startDate.value,"M月D日"))
const endDateStr = computed(() => 
  formatMonthDay(endDate.value,"M月D日"))

  //获取星期
  const days = ['日','一','二','三','四','五','六']
  const today = new Date().getDay()
  //获取今天对应的中文数字
  let chineseDay = days[today]
  let nextDate = today != 6? days[today+1] : days[0]

  //倒计时
  const Down = ref(30)
  function countDown(minutes = 30) {
    let seconds = minutes *60
    const timer = setInterval(() => {
      seconds--
      const min = Math.floor(seconds / 60)

      Down.value = min
      if(seconds === 0)
      clearInterval(timer)
    return 0

    },1000)
  }
</script>

<style lang="less" scoped>
.all {
  background-color: #f7f8fb;
  height: calc(100% - 90px);
  padding-bottom: 60px;
  overflow: scroll;
  .ellipsis-text-1 {
    overflow: hidden;
    word-wrap: normal;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .order-item {
    padding: 0 20px;
    margin-top: 10px;
    background-color: #fff;
    &-title {
      padding: 20px 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .name {
        max-width: 204px;
        font-size: 12px;
        color: #333;
        line-height: 12px;
      }
      .status-name {
        font-size: 18px;
        color: #ff9645;
        letter-spacing: 0;
      }
    }
    &-info {
      position: relative;
      height: 223px;
      width: 100%;
      border-radius: 6px;
      .img-bg {
        width: 100%;
        height: 100%;
        border-radius: 6px;
      }
      .bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        background: rgba(9, 10, 14, 0.7);
        border-radius: 0 0 6px 6px;
        .b-left {
          flex: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
          color: #fff;
          .date {
            padding: 0 20px;
            .day {
              padding: 0;
              margin: 0 0 6px;
              font-size: 16px;
              line-height: 16px;
            }
            .week-time {
              font-size: 12px;
              text-align: center;
              line-height: 12px;
              opacity: 0.8;
            }
          }
          .arrow {
            width: 16px;
            height: 12px;
          }
        }
        .b-right {
          position: relative;
          width: 105px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .name {
            color: #fff;
            text-align: center;
            line-height: 12px;
            opacity: 0.8;
            margin: 0;
            transform: scale(0.9);
          }
          .price {
            margin-top: 5px;
            font-size: 16px;
            color: var(--primary, #ff9645);
            letter-spacing: 0;
            text-align: right;
            line-height: 16px;
          }
        }
        .b-right:before {
          content: '';
          position: absolute;
          top: 10px;
          left: -25px;
          width: 1px;
          height: 40px;
          background-color: #fff;
        }
      }
    }
    &-btn {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      .left {
        .left-content {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          .icon-time {
            width: 11px;
            height: 11px;
            margin-right: 3px;
          }
          .time {
            color: var(--primary-color);
            letter-spacing: 0;
            margin-right: 1px;
          }
          .msg {
            color: #666;
            letter-spacing: 0;
            line-height: 11px;
          }
        }
      }
      .right {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .btn {
          display: inline-block;
          text-align: center;
          line-height: 30px;
          margin-left: 10px;
          font-size: 14px;
          min-width: 75px;
          color: #666;
          background: #fff;
          border: 1px solid #e9e9e9;
          border-radius: 6px;
        }
        .pay {
          color: #fff;
          background-color: var(--primary-color, #ff9645);
          border: 1px solid var(--primary-color, #ff9645);
        }
      }
    }
  }
}
</style>
