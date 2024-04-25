<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, ref, watch } from 'vue'
import { NButton, NLayoutSider } from 'naive-ui'
import List from './List.vue'
import Footer from './Footer.vue'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { PromptStore } from '@/components/common'
import {useRouter} from 'vue-router'
const router = useRouter();  // 使用 useRouter
const appStore = useAppStore()
const chatStore = useChatStore()

const { isMobile } = useBasicLayout()
const show = ref(false)

const collapsed = computed(() => appStore.siderCollapsed)

function goToKnowledgeGraph() {
	 router.push('/knowledge-graph');  // 跳转到知识图谱页面
}
function goToCodeTools() {
  router.push('/code-tools');  // 跳转到代码工具页面
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
    :collapsed="collapsed"
    :collapsed-width="0"
    :width="260"
		position="absolute"
    :show-trigger="isMobile ? false : 'arrow-circle'"
    collapse-mode="transform"

    bordered
    :style="getMobileClass"
    @update-collapsed="handleUpdateCollapsed"
  >
    <div class="flex flex-col h-full" :style="mobileSafeArea">
      <main class="flex flex-col flex-1 min-h-0">
        <div class="p-4">
          <NButton dashed block @click="handleAdd">
           知识问答
          </NButton>
        </div>
        <div class="flex-1 min-h-0 pb-4 overflow-hidden">
          <List />
        </div>
        <div class="p-4">
          <NButton block @click="show = true">
            {{ $t('store.siderButton') }}
          </NButton>
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
    :show-trigger="isMobile ? false : 'arrow-circle'"
    collapse-mode="transform"
    bordered
    :style="getMobileClass"
    @update-collapsed="handleNewSidebarCollapsed"
  >
    <!-- 在这里添加侧边栏的内容 -->
    <div class="flex flex-col h-full">
      <!-- 侧边栏内容 -->
      <div class="p-4">
        <NButton dashed block  @click="goToKnowledgeGraph">
          知识图谱
        </NButton>
				<NButton dashed block  @click="goToCodeTools">
          代码工具
        </NButton>
				<!-- <NButton dashed block>
          资源推荐
        </NButton>
				<NButton dashed block>
          出题
        </NButton> -->
      </div>
    </div>
  </NLayoutSider>

</NLayout>

</template>
