<script setup lang='ts'>
import { NAvatar } from 'naive-ui'
import { ref } from 'vue'

let defaultPortrait = ref("https://c-ssl.duitang.com/uploads/item/202003/08/20200308234634_mhyfj.jpg")
const user = JSON.parse(localStorage.getItem('userInfo') || '{}')

// 如果用户有头像信息，优先使用用户头像
if (user.portrait) {
  defaultPortrait.value = user.portrait
}

function handleAvatarError() {
  // 当头像加载失败时使用默认头像
  defaultPortrait.value = "https://c-ssl.duitang.com/uploads/item/202003/08/20200308234634_mhyfj.jpg"; // 替换为你自己的默认头像 URL
  console.log("头像加载失败，使用默认头像。");
}

console.log(defaultPortrait.value)

</script>

<template>
  <div v-if="user" class="items-center">
    <div class="h-10 items-center-item">
      <NAvatar referrerpolicy="no-referrer" size="large" round :src="defaultPortrait" @error="handleAvatarError" />
    </div>
    <div class="flex-1 min-w-0 items-center-item">
      <h2 style="color:#9cacc0" class="overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
        {{ user.nickname }}
      </h2>
    </div>
  </div>
</template>

<style>
.items-center-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%
}
</style>
