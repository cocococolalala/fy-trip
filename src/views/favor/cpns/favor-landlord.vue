<template>
  <div class="landlord">
    <div class="no-data">
      <img class="icon-no-data" src="@/assets/img/favor/empty_favorite.4399.png" alt="" />
      <div class="name">暂无收藏</div>
      <div class="desp">点击 <img src="@/assets/img/favor/favor.png" /> 即可收藏对应的房东</div>
      <button class="btn" @click="goHome">随便去逛逛</button>
    </div>
  </div>
</template>
 

<script setup>
import { useRouter } from 'vue-router';


const router = useRouter()
const goHome = () => {
  router.push("/home")

}

</script>

<style lang="less" scoped>

.landlord {
  padding: 10px px 20px 55px;
  background-color: #f7f8fb;
  height: calc(100vh - 140px);
  .no-data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon-no-data {
      width: 100%;
    }
    .name {
      color: #333;
      font-size: 20px;
      font-weight: 500;
      line-height: 27px;
    }
    .desp {
      color: #666;
      line-height: 18px;
      font-size: 14px;
      margin: 7px auto 36px;
      img {
        width: 12px;
        vertical-align: middle;
      }
    }
    .btn {
      padding: 0 38px;
      height: 40px;
      line-height: 40px !important;
      font-size: 16px;
      color: #fff;
      background: var(--primary-color);
      border-radius: 20px;
      border: none;
      outline: none;
    }
  }
}
</style>
