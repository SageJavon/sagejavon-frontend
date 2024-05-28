<script setup lang='ts'>
import { NAvatar } from 'naive-ui'
import { ref } from 'vue'

// 调用后端接口获取个人信息
const user = ref(JSON.parse(localStorage.getItem('userInfo')))
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
