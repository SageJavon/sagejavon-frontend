<script lang="ts" setup>
import { ref } from 'vue'
import { NButton, NInput, useMessage } from 'naive-ui'
import { updateUserInfoAPI } from '@/views/chat/api/update_user_info'

const userInfoString = localStorage.getItem('userInfo')
const userInfo = ref(userInfoString ? JSON.parse(userInfoString) : null)

const avatar = ref(userInfo.value.portrait ?? '')
const name = ref(userInfo.value.nickname ?? '')
const gender = ref(userInfo.value.gender ?? '')
const message = useMessage()
function updateUserInfo(field, value) {
  const userInfo = {
    nickname: name.value,
    portrait: avatar.value,
    gender: gender.value,
  }
  updateUserInfoAPI(userInfo)
    .then((res) => {
      if (res.status === 200) {
        // 更新成功，更新本地存储中的用户信息
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        message.info('修改成功', { duration: 2000 })
      }
      else {
        // 更新失败

      }
    })
    .catch((err) => {
      console.error('更新用户信息失败:', err)
    })
}
</script>

<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">头像链接</span>
        <div class="flex-1">
          <NInput v-model:value="avatar" placeholder="" />
        </div>
        <NButton size="tiny" text type="primary" @click="updateUserInfo('portrait', avatar)">
          保存
        </NButton>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">昵称</span>
        <div class="w-[200px]">
          <NInput v-model:value="name" placeholder="" />
        </div>
        <NButton size="tiny" text type="primary" @click="updateUserInfo('nickname', name)">
          保存
        </NButton>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">性别</span>
        <div class="flex items-center space-x-2">
          <input id="male" v-model="gender" type="radio" value="male">
          <label for="male">男</label>
          <input id="female" v-model="gender" type="radio" value="female">
          <label for="female">女</label>
        </div>
        <NButton size="tiny" text type="primary" @click="updateUserInfo('gender', gender)">
          保存
        </NButton>
      </div>
    </div>
  </div>
</template>
