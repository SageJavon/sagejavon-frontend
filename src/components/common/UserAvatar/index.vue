<script setup lang='ts'>
import { NAvatar } from 'naive-ui'

import defaultAvatar from '@/assets/avatar.jpg'

// 调用后端接口获取个人信息
</script>

<template>
  <div class="items-center">
    <div class="h-10 items-center-item">
      <NAvatar size="large" round :src="defaultAvatar" />
    </div>
    <div class="flex-1 min-w-0 items-center-item">
      <h2 class="overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
        name
      </h2>
      <p class="overflow-hidden text-xs text-gray-500 text-ellipsis whitespace-nowrap" />
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
