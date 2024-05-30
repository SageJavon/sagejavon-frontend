<script setup lang='ts'>
import { NAvatar } from 'naive-ui'
import { ref } from 'vue'
import { getUserInfo } from './api/info/get_user_info'

const user = ref<any>(null) // 假设用户信息是任意类型

function getUserInfoF() {
  getUserInfo().then((userInfoRes) => {
    if (userInfoRes.status === 200)
      user.value = userInfoRes.data.data
  }).catch((err) => {
    // 在这里处理获取用户信息失败的情况
    console.log(err)
  })
}

getUserInfoF() // 页面onShow时调用接口获取用户信息
</script>

<template>
  <div v-if="user" class="items-center">
    <div class="h-10 items-center-item">
      <NAvatar size="large" round :src="user.portrait" />
    </div>
    <div class="flex-1 min-w-0 items-center-item">
      <h2 class="overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
        {{ user.nickname }}
      </h2>
    </div>
  </div>
</template>

<style>
.items-center-item{
  display: flex;
  align-items: center;
	justify-content: center;
	width:100%
}
</style>
