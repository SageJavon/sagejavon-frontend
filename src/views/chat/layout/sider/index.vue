<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, ref, watch } from 'vue'
import { NAvatar, NButton, NImage, NLayoutSider, NText } from 'naive-ui'
import { useRouter } from 'vue-router'
import List from './List.vue'
import Footer from './Footer.vue'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import defaultModel from '@/assets/sagejavon.png'
import knowledgeSide from '@/assets/knowledge.png'
const router = useRouter() // 使用 useRouter
const appStore = useAppStore()
const chatStore = useChatStore()

const { isMobile } = useBasicLayout()
const show = ref(false)

const collapsed = computed(() => appStore.siderCollapsed)

function goToKnowledgeGraph() {
	 router.push('/knowledge-graph') // 跳转到知识图谱页面
}
function goToCodeTools() {
  router.push('/code-tools') // 跳转到代码工具页面
}

function handleAdd() {
  chatStore.addHistory({ title: 'New Chat', uuid: Date.now(), isEdit: false })
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
  <NLayout has-sider>
    <NLayoutSider
      :collapsed="false"
      :width="100"
      position="absolute"
      :show-trigger="isMobile ? false : 'arrow-circle'"

      bordered
      :style="getMobileClass"
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
                        :src="knowledgeSide"
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
                        :src="knowledgeSide"
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
                        :src="knowledgeSide"
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

    <!-- 新增的左侧侧边栏 -->
    <NLayoutSider
      :collapsed="newSidebarCollapsed"
      :collapsed-width="0"
      :width="200"
      position="absolute"
      style="left:100px"
      :show-trigger="isMobile ? false : 'arrow-circle'"
      collapse-mode="width"
      bordered
      :style="getMobileClass"
      @update-collapsed="handleNewSidebarCollapsed"
    >
      <div class="flex flex-col h-full" :style="mobileSafeArea">
        <main class="flex flex-1">
          <div class="flex flex-col h-full">
            <div class="p-4">
              <NButton dashed block @click="handleAdd">
                新增知识问答
              </NButton>
            </div>
            <div class="flex-1 min-h-0 pb-4 overflow-hidden">
              <List />
            </div>
          </div>
        </main>
      </div>
    <!-- 在这里添加侧边栏的内容 -->
    </NLayoutSider>
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
