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


function goToKnowledgeSkills() {
  router.push('/knowledge/skills')
}

function chat() {
  router.push('/chat/:uuid?')
}

function goToKnowledgeGraph() {
  router.push('/knowledge/skills') // 跳转到知识图谱页面
}

function goTopersonStudy() {
  console.log('person')
  router.push('/person/study')
}

function goHome() {
  router.push('/')
}

function handleAdd() {
  newChat()
    .then((res) => {
      if (res.status === 200) {
        message.info('新增成功', { duration: 5000 })
        chatStore.addHistory({ title: '新增提问', uuid: res.data.data, isEdit: false })
        localStorage.setItem('active-uuid', res.data.data)
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
    <NLayoutSider :collapsed="false" :width="100" position="absolute" bordered :style="getMobileClass"
      style="background-color:rgba(3, 34, 81, 0.9)" @update-collapsed="handleUpdateCollapsed">
      <div class="flex flex-col h-full" :style="mobileSafeArea">
        <main class="flex flex-col flex-1 min-h-0">
          <div class="p-4">
            <div class="flex flex-col h-full">
              <!-- 侧边栏内容 -->
              <div class="side-container">
                <div class="side-item" @click="goHome">
                  <img size="100" round :src="defaultModel" />
                </div>
                <NDivider />

                <div class="side-item" @click="goToKnowledgeGraph">
                  <div>
                    <div class="side-item2">
                      <NImage class="hover-hand" width="35" :src="knowledgeSide" preview-disabled />
                    </div>

                    <NText style="color: #9cacc0" dashed block @click="goToKnowledgeGraph">
                      知识图谱
                    </NText>
                  </div>
                </div>


                <div class="side-item">
                  <div>
                    <div class="side-item2" @click="chat">
                      <NImage class="hover-hand" preview-disabled width="35" :src="teacher" />
                    </div>

                    <NText style="color:#9cacc0" dashed block @click="chat">
                      聊天
                    </NText>
                  </div>
                </div>


                <div class="side-item">
                  <div>
                    <div class="side-item2">
                      <NImage class="hover-hand" preview-disabled width="35" :src="source" />
                    </div>

                    <NText style="color:#9cacc0" dashed block @click="goToKnowledgeGraph">
                      资源推荐
                    </NText>
                  </div>
                </div>
                <div class="side-item" @click="goTopersonStudy">
                  <div>
                    <div class="side-item2">
                      <NImage class="hover-hand" width="35" :src="study" preview-disabled />
                    </div>

                    <NText style="color:#9cacc0" dashed block>
                      个性学习
                    </NText>
                  </div>
                </div>
                <div class="side-item">
                  <div>
                    <!-- <div class="side-item2" @click="goToKnowledgeSkills">
                      <NImage class="hover-hand" preview-disabled width="35" :src="teacher" />
                    </div> -->
<!-- 
                    <NText style="color:#9cacc0" dashed block @click="goToKnowledgeSkills">
                      知识图谱测试
                    </NText> -->
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
    <NLayoutSider :collapsed="newSidebarCollapsed" :collapsed-width="0" :width="180"
      collapse-mode="transform" :show-trigger="isMobile ? false : 'arrow-circle'"
      style="height:100%;background-color:rgba(3, 34, 81, 0.2)" bordered :style="getMobileClass"
      @update-collapsed="handleNewSidebarCollapsed">
      <div class="flex flex-col h-full w-full" :style="mobileSafeArea">
        <main class="flex flex-1 h-full w-full">
          <div class="flex flex-col h-full w-full">
            <div class="p-4">
              <button
                style="border-radius:20px;background-color: rgba(3, 34, 81, 0.9);color:#ffffff;width:100%;padding-top:8px;padding-bottom:8px"
                block @click="handleAdd">
                新增提问
              </button>
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

.side-item {
  display: flex;
  width: 100%;
  justify-content: center;
  justify-items: center;
  margin-bottom: 20px;
}

.side-item2 {
  display: flex;
  width: 100%;
  justify-content: center;
  justify-items: center;
}

.hover-hand {
  cursor: pointer;
  /* 默认鼠标样式为小手掌 */
}

.hover-hand:hover {
  cursor: pointer;
  /* 鼠标悬停时仍然显示小手掌 */
}
</style>
