<script setup lang='ts'>
import { NAvatar } from 'naive-ui'
import { ref } from 'vue'

let defaultPortrait = ref("https://tse4-mm.cn.bing.net/th/id/OIP-C.IJqR74BwudERFnq5R-h92AAAAA?rs=1&pid=ImgDetMain")
const user = JSON.parse(localStorage.getItem('userInfo') || '{}')

if (user.portrait) {
  defaultPortrait.value = user.portrait
}

console.log(defaultPortrait.value)

</script>

<template>
  <div v-if="user" class="items-center">
    <div class="h-10 items-center-item">
      <NAvatar referrerpolicy="no-referrer" size="large" round :src="defaultPortrait" />
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
