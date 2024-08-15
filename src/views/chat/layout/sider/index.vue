<script setup lang="ts">
import type { CSSProperties } from "vue";
import { computed, ref, watch } from "vue";
import {
  NAvatar,
  NButton,
  NDivider,
  NImage,
  NLayoutSider,
  NText,
  NSpin,
  useMessage,
} from "naive-ui";
import { useRouter } from "vue-router";
import List from "./List.vue";
import Footer from "./Footer.vue";
import { useAppStore, useChatStore } from "@/store";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import defaultModel from "@/assets/sagejavon.png";
import knowledgeSide from "@/assets/knowledge.png";
import source from "@/assets/source.png";
import study from "@/assets/study.png";
import teacher from "@/assets/teacher.png";
import { newChat } from "@/views/chat/api/new_chat";

const router = useRouter();
const appStore = useAppStore();
const chatStore = useChatStore();
const { isMobile } = useBasicLayout();
const show = ref(true);
const message = useMessage();
const loading = ref(false); // 加载状态

const collapsed = computed(() => appStore.siderCollapsed);
const uuid = localStorage.getItem("active-uuid");
function goToKnowledgeSkills() {
  router.push("/knowledge/skills");
}

function chat() {
  show.value = true;
  router.push(`/chat/${uuid}`);
}

function goToKnowledgeGraph() {
  show.value = false;
  router.push("/knowledge/skills");
}

function goTopersonStudy() {
  console.log("person");
  show.value = false;
  router.push("/person/study");
}

function goToProgram() {
  show.value = false;
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
    <NLayoutSider
      :collapsed="false"
      :width="100"
      position="absolute"
      bordered
      :style="getMobileClass"
      style="background-color: rgba(3, 34, 81, 0.9)"
      @update-collapsed="handleUpdateCollapsed"
    >
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
                      <NImage
                        class="hover-hand"
                        width="35"
                        :src="knowledgeSide"
                        preview-disabled
                      />
                    </div>

                    <NText
                      style="color: #9cacc0"
                      dashed
                      block
                      @click="goToKnowledgeGraph"
                    >
                      知识图谱
                    </NText>
                  </div>
                </div>

                <div class="side-item">
                  <div>
                    <div class="side-item2" @click="chat">
                      <NImage
                        class="hover-hand"
                        preview-disabled
                        width="35"
                        :src="teacher"
                      />
                    </div>

                    <NText style="color: #9cacc0" dashed block @click="chat">
                      知识问答
                    </NText>
                  </div>
                </div>

                <div class="side-item">
                  <div @click="goToProgram">
                    <div class="side-item2">
                      <NImage
                        class="hover-hand"
                        preview-disabled
                        width="35"
                        :src="source"
                      />
                    </div>

                    <NText
                      style="color: #9cacc0"
                      dashed
                      block
                      @click="goToKnowledgeGraph"
                    >
                      编程导师
                    </NText>
                  </div>
                </div>
                <div class="side-item" @click="goTopersonStudy">
                  <div>
                    <div class="side-item2">
                      <NImage
                        class="hover-hand"
                        width="35"
                        :src="study"
                        preview-disabled
                      />
                    </div>

                    <NText style="color: #9cacc0" dashed block>
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
      <div
        v-show="!collapsed"
        class="fixed inset-0 z-40 w-full h-full bg-black/40"
        @click="handleUpdateCollapsed"
      />
    </template>

    <!-- 加载指示器 -->
    <div
      v-if="loading"
      class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    >
      <NSpin size="large" />
    </div>

    <NLayoutSider
      v-if="show"
      :collapsed="newSidebarCollapsed"
      :collapsed-width="0"
      :width="220"
      collapse-mode="transform"
      :show-trigger="isMobile ? false : 'arrow-circle'"
      style="height: 100%; background-color: rgba(3, 34, 81, 0.2)"
      bordered
      :style="getMobileClass"
      @update-collapsed="handleNewSidebarCollapsed"
    >
      <div class="flex flex-col h-full w-full" :style="mobileSafeArea">
        <main class="flex flex-1 h-full w-full">
          <div class="flex flex-col h-full w-full">
            <div class="p-4">
              <button
                style="
                  border-radius: 20px;
                  background-color: rgba(3, 34, 81, 0.9);
                  color: #ffffff;
                  width: 100%;
                  padding-top: 8px;
                  padding-bottom: 8px;
                "
                block
                @click="handleAdd"
              >
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
  user-select: none;
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

.side-item {
  cursor: pointer;
}

.side-item:hover {
  cursor: pointer;
}

.fixed-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
}
</style>
