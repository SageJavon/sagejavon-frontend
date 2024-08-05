<template>
  <div class="full-height">
    <div class="container">
      <div class="container-two">
        <div class="sidebar">
          <div class="tabs">
            <div class="circle-flex">
              <div class="circle"></div>
              <div
                @click="activeTab = 'content'"
                :class="{ active: activeTab === 'content' }"
              >
                题目内容
              </div>
            </div>
            <div class="circle-flex">
              <div class="circle"></div>
              <div
                @click="activeTab = 'history'"
                :class="{ active: activeTab === 'history' }"
              >
                历史记录
              </div>
            </div>
            <div class="circle-flex">
              <div class="circle"></div>
              <div
                @click="activeTab = 'solution'"
                :class="{ active: activeTab === 'solution' }"
              >
                正确题解
              </div>
            </div>
          </div>
          <div class="content">
            <div class="content-navigation">
              <div
                class="navigation"
                v-if="activeTab === 'content' && !isLoading"
              >
                <button @click="previousQuestion" class="nav-button">
                  <img :src="iconLeftArrow" />
                </button>
              </div>
              <div v-if="isLoading" class="editor">
                Loading...
                <!-- Placeholder while loading -->
              </div>
              <div v-else-if="activeTab === 'content' && choiceDetail">
                <div>
                  <div class="sub-section">
                    <span class="tag">{{ choiceDetail.difficulty }}</span>
                    <span
                      class="knowledge-point"
                      v-for="(
                        knowledge, index
                      ) in choiceDetail.knowledgeConcept"
                      :key="index"
                    >
                      <i class="icon-tag"></i> {{ knowledge.knowledge }}
                    </span>
                  </div>
                  <v-md-preview
                    :text="choiceDetail.questionText"
                  ></v-md-preview>
                  <div class="choices">
                    <div
                      :class="{
                        'choices-item': true,
                        'correct-choice':
                          choiceDetail.choice === 'A' &&
                          choiceDetail.score === 1,
                        'wrong-choice':
                          choiceDetail.choice === 'A' &&
                          choiceDetail.score === 0,
                      }"
                      @click="submitChoice('A')"
                    >
                      <span class="option">A.</span> {{ choiceDetail.choiceA }}
                    </div>
                    <div
                      :class="{
                        'choices-item': true,
                        'correct-choice':
                          choiceDetail.choice === 'B' &&
                          choiceDetail.score === 1,
                        'wrong-choice':
                          choiceDetail.choice === 'B' &&
                          choiceDetail.score === 0,
                      }"
                      @click="submitChoice('B')"
                    >
                      <span class="option">B.</span> {{ choiceDetail.choiceB }}
                    </div>
                    <div
                      :class="{
                        'choices-item': true,
                        'correct-choice':
                          choiceDetail.choice === 'C' &&
                          choiceDetail.score === 1,
                        'wrong-choice':
                          choiceDetail.choice === 'C' &&
                          choiceDetail.score === 0,
                      }"
                      @click="submitChoice('C')"
                    >
                      <span class="option">C.</span> {{ choiceDetail.choiceC }}
                    </div>
                    <div
                      :class="{
                        'choices-item': true,
                        'correct-choice':
                          choiceDetail.choice === 'D' &&
                          choiceDetail.score === 1,
                        'wrong-choice':
                          choiceDetail.choice === 'D' &&
                          choiceDetail.score === 0,
                      }"
                      @click="submitChoice('D')"
                    >
                      <span class="option">D.</span> {{ choiceDetail.choiceD }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>没有更多题目了~</div>
              <div
                class="navigation"
                v-if="activeTab === 'content' && !isLoading"
              >
                <button @click="nextQuestion" class="nav-button">
                  <img :src="iconRightArrow" />
                </button>
              </div>
            </div>
            <div v-if="activeTab === 'history'">
              <p>这里显示历史记录...</p>
            </div>
            <div v-if="activeTab === 'solution'">
              <p>这里显示正确题解...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { choiceDetails } from "./api/choice_detail";
import { questionSelect } from "./api/question_select";
import iconLeftArrow from "./images/left-arrow.png";
import iconRightArrow from "./images/right-arrow.png";

const route = useRoute();
const router = useRouter();
const questionId = ref(route.query.id);
const activeTab = ref("content");
const choiceDetail = ref<Choice>({});
const isLoading = ref(false); // Track loading state

const getChoiceDetail = async (id) => {
  isLoading.value = true; // Start loading
  try {
    const res = await choiceDetails(id);
    if (res.status === 200) {
      console.log(res);
      choiceDetail.value = res.data.data;
    } else {
      // Handle error
    }
  } catch (err) {
    console.error("获取选择题详情失败:", err);
  } finally {
    isLoading.value = false; // Stop loading
  }
};

getChoiceDetail(questionId.value);

export interface Choice {
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  difficulty: number;
  id: number;
  knowledgeConcept: KnowledgeConcept[];
  questionText: string;
  score: number; // Add score property to Choice interface
  choice: string;
}

export interface KnowledgeConcept {
  knowledge: string;
  knowledgeId: number;
}

function submitChoice(choice: string) {
  const request = {
    choice: choice,
    id: questionId.value,
  };

  questionSelect(request)
    .then((response) => {
      console.log("提交成功:", response.data);
      // Update choiceDetail with the received data
      choiceDetail.value.score = response.data.data.score;
      choiceDetail.value.choice = choice;
    })
    .catch((error) => {
      console.error("提交失败:", error);
      // Handle error
    });
}

function previousQuestion() {
  const prevId = getPreviousQuestionId(questionId.value);
  if (prevId) {
    questionId.value = prevId;
    getChoiceDetail(prevId);
    router.push({
      path: "/choice/detail",
      query: { id: prevId },
    });
  }
}

function nextQuestion() {
  const nextId = getNextQuestionId(questionId.value);
  if (nextId) {
    questionId.value = nextId;
    getChoiceDetail(nextId);
    router.push({
      path: "/choice/detail",
      query: { id: nextId },
    });
  }
}

// Dummy functions to get the previous and next question IDs
// Replace these with your actual logic to get the correct IDs
function getPreviousQuestionId(currentId) {
  return Number(currentId) - 1; // Example logic
}

function getNextQuestionId(currentId) {
  return Number(currentId) + 1; // Example logic
}
</script>

<style scoped>
.full-height {
  height: 100vh; /* Ensure full viewport height */
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  flex-direction: column; /* Stack children vertically */
  background-color: #f7f7f7;
}

.container {
  flex: 1; /* Take remaining space */
  padding: 20px;
  width: 100vw;
  display: flex;
  justify-content: center; /* Center content horizontally */
  align-items: center; /* Center content vertically */
}

.container-two {
  width: 60%;
  height: 95%;
  display: flex;
  background-color: #ffffff;
  border-radius: 10px;
}

.sidebar {
  flex: 1;
  height: 100%;
  overflow: auto;
  border-radius: 10px;

  /* Enable scrolling for the sidebar */
  /* Add padding inside the sidebar */
}

.main {
  border-radius: 10px;
  flex: 1;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--, #e6e6e6);
  /* Add padding inside the main content */
}

.editor {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #d3d1d1;
}

.circle {
  width: 20px;
  height: 20px;
  background-color: #d6d3d3;
  border-radius: 100%;
}

.circle-flex {
  display: flex;
  justify-items: center;
  justify-content: center;
  align-items: center;
  line-height: 1.4;
  margin-left: 10px;
}

.tabs {
  height: 35px;
  display: flex;
  margin-bottom: 20px;
  justify-content: left;
  background-color: #e6e6e6;
}

.tabs div {
  padding: 5px;
  cursor: pointer;
}

.tabs-two {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 35px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f2f1f1;
}

.tabs-two button {
  flex: 1;
  padding: 5px;
}

.tabs div {
  transition: background-color 0.3s;
  color: #808080;
}

.tabs div.active {
  color: black;
}

.tabs div:not(:last-child) {
  border-right: none;
}

.sub-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 20px;
  /* Adds space between the two elements */
}

.tag {
  background-color: #f5f5f5;
  color: rgb(214, 62, 62);
  padding: 5px 10px;
  border-radius: 15px;
  font-weight: bold;
}

.knowledge-point {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 5px 10px;
  border-radius: 15px;
  color: #666;
  font-weight: bold;
}

.icon-tag {
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-right: 5px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23666" d="M21.41 11.58l-9-9A2 2 0 0010.34 2H4a2 2 0 00-2 2v6.34a2 2 0 00.58 1.42l9 9a2 2 0 002.83 0l6.34-6.34a2 2 0 000-2.83zM6.5 8.5A1.5 1.5 0 118 7a1.5 1.5 0 01-1.5 1.5z"/></svg>')
    no-repeat center center;
  background-size: contain;
}

.choices {
  margin-left: 30px;
}

.choices-item {
  margin-top: 10px;
  border-radius: 20px;
  padding: 2px;
  padding-left: 10px;
}

.choices-item:hover {
  background-color: #f2f1f1;
  padding: 10px;
  cursor: pointer;
  border-radius: 10px;
}

.option {
  font-weight: 600;
  margin-right: 10px;
}

.correct-choice {
  background: linear-gradient(
    87.37deg,
    rgba(0, 255, 87, 0.6) 2.19%,
    rgba(255, 255, 255, 0.2) 15.05%
  );
  /* Light green for correct choice */
}

.wrong-choice {
  background: linear-gradient(
    87.37deg,
    rgba(255, 0, 0, 0.4) 2.19%,
    rgba(255, 255, 255, 0.2) 15.05%
  );
  /* Light red for wrong choice */
}

.content {
  width: 100%;
  display: flex;
  justify-content: center;
  height: 85%;
  align-items: center;
  align-content: center;
}

.content-navigation {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-button {
  padding: 6px 4px;
  border-radius: 8px;
  background-color: #052350;
  border: none;
  cursor: pointer;
  font-weight: bold;
  margin: 0 10px;
  align-items: center;
  transition: background-color 0.3s;
}

.nav-button:hover {
  background-color: #b0aeae;
}
</style>
