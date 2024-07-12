<template>
  <div class="person-study-container">
    <div class="card choice-question">
      <MainCard :image="iconSelect" title="选择题" @click="navigateChoice"></MainCard>
    </div>
    <div class="card code-question">
      <MainCard :image="iconCode" title="代码题" @click="navigateProgram"></MainCard>
    </div>
    <div class="card history">
      <MainCard :image="iconHistory" title="历史记录"></MainCard>
    </div>
    <div class="card hot-question"></div>
    <div class="card recent-record"></div>
    <div class="card daily-recommendation" @click="navigateRecommend">
      <div class="recommendation">
        <div>
          <image style="width:100px" :src="iconRecommend" />
        </div>
        <div>每日推荐</div>
        <div>
          <div>·采用AI算法为你量身定制</div>
          <div>
            ·根据您的学习进度每日自动刷新
          </div>
          <div>
            ·快来体验您的专属题单吧</div>

        </div>
      </div>
    </div>
    <div class="card statistics"></div>
    <div class="card line-chart"></div>
  </div>
</template>

<script setup>
import MainCard from "@/views/person-study/components/MainCard.vue";
import iconSelect from "./images/select-question.png"
import iconCode from "./images/code-question.png"
import iconHistory from "./images/history.png"
import iconRecommend from "./images/daily-recommend.png"
import { useRouter } from 'vue-router'
const router = useRouter()
function navigateProgram () {
  router.push('/program/exercise')
}
function navigateChoice () {
  router.push('/choice/exercise')
}
function navigateRecommend () {
  router.push('/recommend/exercise')
}

</script>

<style>
* {
  --theme-blue: #052350;
  --card-radius: 16px;
  --card-background-color: linear-gradient(108.33deg, #052B65 0%, #053B8B 101.33%);
  --daily-card-background-clolor: linear-gradient(90deg, #074CB5 0%, #0CD089 100%);
}

.person-study-container {
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(32, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 1rem;
  padding: 2rem 2rem;
}

.card {
  background: var(--card-background-color);
  border-radius: var(--card-radius);
  transition: all 0.1s ease-in-out;
}

.card:hover {
  transform: translate(-4px, -4px);
  box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.2);
}

.choice-question,
.code-question,
.history {
  grid-column-start: span 8;
}

.hot-question {
  grid-column: span 8;
  grid-row: span 2;
}

.recent-record {
  grid-column: span 10;
  grid-row: span 2;
}

.daily-recommendation {
  grid-column: span 14;
  background: var(--daily-card-background-clolor);
}

.recommendation {
  display: flex;

}

.recommendation image {
  width: 100px;
  height: 100px;
}

.statistics {
  grid-column: span 7;
}

.line-chart {
  grid-column: span 15;
}
</style>
