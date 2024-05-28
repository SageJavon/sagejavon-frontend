<script lang="ts" setup>
import { ref } from 'vue'
import { NImage } from 'naive-ui'

import defaultAvatar from '@/assets/avatar.jpg'
import defaultModel from '@/assets/sagejavonchat.png'

interface Props {
  image?: boolean
}
defineProps<Props>()
const user = ref(JSON.parse(localStorage.getItem('userInfo')))
</script>

<template>
  <template v-if="image">
    <NImage v-if="user.portrait" :src="user.portrait" :fallback-src="defaultAvatar" />
    <Image v-else round :src="defaultAvatar" />
  </template>
  <div v-else>
    <NImage :src="defaultModel" />
  </div>
</template>
