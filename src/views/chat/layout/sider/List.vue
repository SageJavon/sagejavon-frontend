<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NInput, NPopconfirm, NScrollbar, useMessage } from 'naive-ui'
import { SvgIcon } from '@/components/common'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { debounce } from '@/utils/functions/debounce'
import { chatList } from '@/views/chat/api/chat_list'
import { deleteChat } from '@/views/chat/api/delete_chat'

const { isMobile } = useBasicLayout()
const message = useMessage()
const appStore = useAppStore()
const chatStore = useChatStore()

interface OriginalData {
  chatId: number
  title: string | null
  longTerm: number
  updateTime: string
}

interface TransformedData {
  title: string
  uuid: number
  isEdit: boolean
}

function transformData(originalData: OriginalData[]): TransformedData[] {
  return originalData.map((item, index) => ({
    title: item.title || '知识问答' + index,
    uuid: item.chatId,
    isEdit: false,
  }))
}

const originalData = ref<OriginalData[]>([])

const transformedData = ref<TransformedData[]>([])


const getChatList = async () => {
  // localStorage.removeItem('chatStorage')

  try {
    const res = await chatList() // 假设 chatList 是一个异步请求函数
    if (res.status === 200) {
      originalData.value = res.data.data
      transformedData.value = transformData(originalData.value)

      // chatStore.addHistory({ title: '新增提问', uuid: res.data.data, isEdit: false })
      transformedData.value.forEach((item) => {
        if (!chatStore.history.some(chat => chat.uuid === item.uuid)) {
          chatStore.addHistory({ title: '知识问答' + item.uuid, uuid: item.uuid, idEdit: false })
        }
        // chatStore.addHistory({ title: '知识问答' + item.uuid, uuid: item.uuid, idEdit: false })
      })
      console.log(transformedData.value)
    }
    else {
      // 更新失败
    }
  }
  catch (err) {
    console.error('获取聊天列表失败:', err)
  }
}

getChatList()
const dataSources = computed(() => chatStore.history)
// const dataSources = computed(() => {
//   const transformedUuids = transformedData.value.map(item => item.uuid)
//   return chatStore.history.filter(chat => transformedUuids.includes(chat.uuid))
// })

async function handleSelect({ uuid }: Chat.History) {
  localStorage.setItem('active-uuid', String(uuid))
  console.log(localStorage.getItem('active-uuid'))
  if (isActive(uuid))
    return

  if (chatStore.active)
    chatStore.updateHistory(chatStore.active, { isEdit: false })
  await chatStore.setActive(uuid)

  if (isMobile.value)
    appStore.setSiderCollapsed(true)
  window.location.reload();
}

function handleEdit({ uuid }: Chat.History, isEdit: boolean, event?: MouseEvent) {
  event?.stopPropagation()
  chatStore.updateHistory(uuid, { isEdit })
}

function handleDelete(index: number, event?: MouseEvent | TouchEvent) {
  // 根据chatid删除
  deleteChat(Number(localStorage.getItem('active-uuid')))
    .then((res) => {
      console.log(res)
      if (res.status === 200) {
        message.info('删除成功', { duration: 5000 })
      }
      else {
        // 更新失败

      }
    })
    .catch((err) => {
      console.error('新增失败:', err)
    })
  event?.stopPropagation()
  chatStore.deleteHistory(index)
  // if (chatStore.history.length === 0)
  //   chatStore.addHistory({ title: 'New Chat', uuid: index, isEdit: false })

  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

const handleDeleteDebounce = debounce(handleDelete, 600)

function handleEnter({ uuid }: Chat.History, isEdit: boolean, event: KeyboardEvent) {
  event?.stopPropagation()
  if (event.key === 'Enter')
    chatStore.updateHistory(uuid, { isEdit })
}

function isActive(uuid: number) {
  return chatStore.active === uuid
}
</script>

<template>
  <NScrollbar class="px-4">
    <div class="flex flex-col gap-2 text-sm">
      <template v-if="!dataSources.length">
        <div class="flex flex-col items-center mt-4 text-center text-neutral-300">
          <SvgIcon icon="ri:inbox-line" class="mb-2 text-3xl" />
          <span>{{ $t('common.noData') }}</span>
        </div>
      </template>
      <template v-else>
        <div v-for="(item, index) of dataSources" :key="index">
          <a class="relative flex items-center gap-3 px-3 py-3 break-all rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#E44446FF]"
            :class="isActive(item.uuid) && ['bg-neutral-100', 'text-[rgba(3, 34, 81, 1)]', 'dark:bg-[#E44446FF]', 'pr-14']"
            @click="handleSelect(item)" style="border-radius:20px">
            <span>
              <SvgIcon icon="ri:message-3-line" />
            </span>
            <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap">
              <NInput v-if="item.isEdit" v-model:value="item.title" size="tiny"
                @keypress="handleEnter(item, false, $event)" />
              <span v-else>{{ item.title }}</span>
            </div>
            <div v-if="isActive(item.uuid)" class="absolute z-10 flex visible right-1">
              <template v-if="item.isEdit">
                <button class="p-1" @click="handleEdit(item, false, $event)">
                  <SvgIcon icon="ri:save-line" />
                </button>
              </template>
              <template v-else>
                <button class="p-1">
                  <SvgIcon icon="ri:edit-line" @click="handleEdit(item, true, $event)" />
                </button>
                <NPopconfirm placement="bottom" @positive-click="handleDeleteDebounce(index, $event)">
                  <template #trigger>
                    <button class="p-1">
                      <SvgIcon icon="ri:delete-bin-line" />
                    </button>
                  </template>
                  {{ $t('chat.deleteHistoryConfirm') }}
                </NPopconfirm>
              </template>
            </div>
          </a>
        </div>
      </template>
    </div>
  </NScrollbar>
</template>
