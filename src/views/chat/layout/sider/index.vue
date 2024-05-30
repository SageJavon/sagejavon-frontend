<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, ref, watch } from 'vue'
import { NAvatar, NButton, NDivider, NImage, NLayoutSider, NText, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import List from './List.vue'
import Footer from './Footer.vue'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import defaultModel from '@/assets/sagejavon.png'
import knowledgeSide from '@/assets/knowledge.png'
import source from '@/assets/source.png'
import study from '@/assets/study.png'
import teacher from '@/assets/teacher.png'
import { newChat } from '@/views/chat/api/new_chat'
const router = useRouter() // 使用 useRouter
const appStore = useAppStore()
const chatStore = useChatStore()

const { isMobile } = useBasicLayout()
const show = ref(false)
const message = useMessage()

const collapsed = computed(() => appStore.siderCollapsed)

function goToKnowledgeGraph() {
	 router.push('/knowledge/graph') // 跳转到知识图谱页面
}

function handleAdd() {
  newChat()
    .then((res) => {
      if (res.status === 200) {
        message.info('新增成功', { duration: 5000 })
				  chatStore.addHistory({ title: '新增提问', uuid: res.data.data, isEdit: false })
      }
      else {
        // 更新失败

      }
    })
    .catch((err) => {
      console.error('新增失败:', err)
    })
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

const getMobileClass = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      position: 'fixed',
      zIndex: 50,
    }
  }
  return {}
})

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: 'env(safe-area-inset-bottom)',
    }
  }
  return {}
})

watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val)
  },
  {
    immediate: true,
    flush: 'post',
  },
)
</script>

<template>
  <NLayout has-sider sider-placement="left">
    <NLayoutSider
      :collapsed="false"
      :width="100"
      position="absolute"
      bordered
      :style="getMobileClass"
      style="background-color:#e7e7e7"
      @update-collapsed="handleUpdateCollapsed"
    >
      <div class="flex flex-col h-full" :style="mobileSafeArea">
        <main class="flex flex-col flex-1 min-h-0">
          <div class="p-4">
            <div class="flex flex-col h-full">
              <!-- 侧边栏内容 -->
              <div class="side-container">
                <div class="side-item">
                  <NAvatar size="100" round :src="defaultModel" />
                </div>
                <NDivider />

                <div class="side-item" @click="goToKnowledgeGraph">
                  <div>
                    <div class="side-item2">
                      <NImage
                        width="35"
                        :src="knowledgeSide"
                        preview-disabled
                      />
                    </div>

                    <NText dashed block @click="goToKnowledgeGraph">
                      知识图谱
                    </NText>
                  </div>
                </div>

                <div class="side-item">
                  <div>
                    <div class="side-item2">
                      <NImage
                        width="35"
                        :src="source"
                      />
                    </div>

                    <NText dashed block @click="goToKnowledgeGraph">
                      资源推荐
                    </NText>
                  </div>
                </div>
                <div class="side-item">
                  <div>
                    <div class="side-item2">
                      <NImage
                        width="35"
                        :src="study"
                      />
                    </div>

                    <NText dashed block @click="goToKnowledgeGraph">
                      个性学习
                    </NText>
                  </div>
                </div>
                <div class="side-item">
                  <div>
                    <div class="side-item2">
                      <NImage
                        width="35"
                        :src="teacher"
                      />
                    </div>

                    <NText dashed block @click="goToKnowledgeGraph">
                      老师出题
                    </NText>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </NLayoutSider>

    <template v-if="isMobile">
      <div v-show="!collapsed" class="fixed inset-0 z-40 w-full h-full bg-black/40" @click="handleUpdateCollapsed" />
    </template>
    <!-- <PromptStore v-model:visible="show" /> -->
    <NLayoutSider

      :collapsed="newSidebarCollapsed"
      :collapsed-width="0"
      :width="180"
      collapse-mode="transform"
      :show-trigger="isMobile ? false : 'arrow-circle'"
      style="height:100%;background-color:#eeeeee"
      bordered
      :style="getMobileClass"
      @update-collapsed="handleNewSidebarCollapsed"
    >
      <div class="flex flex-col h-full w-full" :style="mobileSafeArea">
        <main class="flex flex-1 h-full w-full">
          <div class="flex flex-col h-full w-full">
            <div class="p-4">
              <NButton dashed block @click="handleAdd">
                新增提问
              </NButton>
            </div>
            <div class="flex-1 min-h-0 pb-4 overflow-hidden h-full">
              <List />
            </div>
          </div>
        </main>
      </div>
    <!-- 在这里添加侧边栏的内容 -->
    </NLayoutSider>

    <!-- 新增的左侧侧边栏 -->
  </NLayout>
</template>

<style>
.side-container {
  height: 100%;
  overflow-y: auto;

}

.side-item{
	display:flex;
	width:100%;
	justify-content: center;
	justify-items: center;
	margin-bottom:20px;
}

.side-item2{
	display:flex;
	width:100%;
	justify-content: center;
	justify-items: center;
}
</style>
