<script setup lang="ts">
import type { CSSProperties } from "vue";
import { computed, reactive, ref, watch } from "vue";
import {
  NLayoutSider,
  NSpin,
  useMessage,
} from "naive-ui";
import { useRouter } from "vue-router";
import List from "./List.vue";
import Footer from "./Footer.vue";
import { useAppStore, useChatStore } from "@/store";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import defaultModel from "@/assets/sagejavon.png";
import { newChat } from "@/views/chat/api/new_chat";
import icon from "../icon/index";

const router = useRouter();
const appStore = useAppStore();
const chatStore = useChatStore();
const { isMobile } = useBasicLayout();
const show = ref(true);
const message = useMessage();
const loading = ref(false); // 加载状态

const collapsed = computed(() => appStore.siderCollapsed);
const uuid = localStorage.getItem("active-uuid");

const icons = function () {
  let dataInit = reactive([icon.mindmap, icon.chat, icon.code, icon.study]);
  let data = ref([...dataInit]); // 使用 ref 创建响应式对象
  let activeIndex = ref(-1); // 当前激活的 icon 索引
  function reset() {
    data.value = dataInit.slice();
  }
  function activate(index: number = -1) {
    reset();
    if (index === -1) {
      return data;
    }
    activeIndex.value = index;
    switch (index) {
      case 0:
        data.value[0] = icon.mindmapActive;
        break;
      case 1:
        data.value[1] = icon.chatActive;
        break;
      case 2:
        data.value[2] = icon.codeActive;
        break;
      case 3:
        data.value[3] = icon.studyActive;
        break;
    }
    return data.value;
  }
  function get() {
    return data.value;
  }
  return { activate, reset, get, activeIndex };
};
const myIcons = icons();
// 根据当前路由初始化侧边栏图标
{
  show.value = false;
  switch (router.currentRoute.value.path) {
    case "/chat/:uuid":
      show.value = true;
      myIcons.activate(1);
      break;
    case "/knowledge/skills":
      myIcons.activate(0);
      break;
    case "/program/tutor":
      myIcons.activate(2);
      break;
    case "/person/study":
      myIcons.activate(3);
      break;
    default:
      myIcons.activate(1); // 默认值
      break;
  }
}
const sidebarIcons = computed(() => myIcons.get());

function chat() {
  show.value = true;
  myIcons.activate(1);
  router.push(`/chat/${uuid}`);
}

function goToKnowledgeGraph() {
  show.value = false;
  myIcons.activate(0);
  router.push("/knowledge/skills");
}

function goTopersonStudy() {
  show.value = false;
  myIcons.activate(3);
  router.push("/person/study");
}

function goToProgram() {
  show.value = false;
  myIcons.activate(2);
  router.push("/program/tutor");
}

function goHome() {
  router.push("/");
}

function handleAdd() {
  loading.value = true; // 开始加载
  newChat()
    .then((res) => {
      if (res.status === 200) {
        message.info("新增成功", { duration: 5000 });
        chatStore.addHistory({
          title: "知识问答" + res.data.data,
          uuid: res.data.data,
          isEdit: false,
        });
        localStorage.setItem("active-uuid", res.data.data);
      } else {
        // 更新失败
      }
    })
    .catch((err) => {
      console.error("新增失败:", err);
    })
    .finally(() => {
      loading.value = false; // 结束加载
    });
  if (isMobile.value) appStore.setSiderCollapsed(true);
}

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value);
}

const getMobileClass = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      position: "fixed",
      zIndex: 50,
    };
  }
  return {};
});

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: "env(safe-area-inset-bottom)",
    };
  }
  return {};
});

watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val);
  },
  {
    immediate: true,
    flush: "post",
  }
);
</script>

<template>
  <NLayout has-sider sider-placement="left">
    <NLayoutSider :collapsed="false" :width="80" position="absolute" bordered :style="getMobileClass"
      @update-collapsed="handleUpdateCollapsed">
      <div class="flex flex-col h-full" :style="mobileSafeArea">
        <main class="flex flex-col flex-1 min-h-0">
          <!-- 侧边栏内容 -->
          <div class="side-container">
            <div class="side-top-icon" @click="goHome">
              <img :src="defaultModel" />
            </div>

            <div class="divider"></div>

            <div class="side-content">
              <div class="side-item" @click="goToKnowledgeGraph">
                <img :src="sidebarIcons[0]" />
                <text :class="{ activeText: myIcons.activeIndex.value === 0 }">知识图谱</text>
              </div>
              <div class="side-item" @click="chat">
                <img :src="sidebarIcons[1]" />
                <text :class="{ activeText: myIcons.activeIndex.value === 1 }">知识问答</text>
              </div>
              <div class="side-item" @click="goToProgram">
                <img :src="sidebarIcons[2]" />
                <text :class="{ activeText: myIcons.activeIndex.value === 2 }">编程导师</text>
              </div>
              <div class="side-item" @click="goTopersonStudy">
                <img :src="sidebarIcons[3]" />
                <text :class="{ activeText: myIcons.activeIndex.value === 3 }">个性学习</text>
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

    <!-- 加载指示器 -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <NSpin size="large" />
    </div>

    <NLayoutSider v-if="show" :collapsed="newSidebarCollapsed" :collapsed-width="0" :width="200"
      collapse-mode="transform" :show-trigger="isMobile ? false : 'arrow-circle'"
      style="height: 100%; background-color: rgba(3, 34, 81, 0.2)" bordered :style="getMobileClass"
      @update-collapsed="handleNewSidebarCollapsed">
      <div class="flex flex-col h-full w-full" :style="mobileSafeArea">
        <main class="flex flex-1 h-full w-full">
          <div class="flex flex-col h-full w-full">
            <div class="p-4">
              <button style="
                  border-radius: 20px;
                  background-color: rgba(3, 34, 81, 0.9);
                  color: #ffffff;
                  width: 100%;
                  padding-top: 8px;
                  padding-bottom: 8px;
                " block @click="handleAdd">
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

<style lang="less" scoped>
.side-container {
  height: 100%;
  overflow-y: auto;
  user-select: none;

  .side-top-icon {
    cursor: pointer;
    width: 58px;
    height: 58px;
    margin: 12px auto 0;
  }

  .divider {
    height: 1px;
    width: 64px;
    background-color: var(--fourth-text-color);
    margin: 12px auto 20px;
    border-radius: 1px;
  }

  .side-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 24px;

    .side-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      row-gap: 8px;
      cursor: pointer;
      border-radius: 6px;
      padding: 4px 6px;
      transition: background-color 200ms ease-out;

      &:hover {
        background-color: #00000012;
      }

      img {
        width: 32px;
        height: 32px;
      }

      text {
        font-size: 13px;
        line-height: 1.5;
        color: var(--second-text-color);
      }

      text.activeText {
        color: #e95900;
      }
    }
  }
}
</style>
