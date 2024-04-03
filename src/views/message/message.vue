<template>
  <div class="message">
    <van-nav-bar title="消息中心" left-text="" left-arrow @click-left="onClickLeft" >
      <template #right>
        <img src="@/assets/img/home/icon-right-menu.png" width="20" height="15" />
      </template>
    </van-nav-bar>
    <div class="content">
      <img src="@/assets/img/message/icon_message.png" alt="">
      <div class="text" >暂无聊天消息</div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
// 监听返回按钮的点击
const onClickLeft = () => {
  router.back()
}

</script>

<style scoped lang="less">
.message{
  background-color: #f7f8fb;
  height: 100vh;
  .content{

    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;
    img{
      width: 88%;
    }
  }
}
</style>
