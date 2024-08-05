<template>
  <div class="person-study-container">
    <div class="card choice-question">
      <MainCard :image="iconSelect" title="选择题" :description="choiceDescription" @click="navigateChoice"></MainCard>
    </div>
    <div class="card code-question">
      <MainCard :image="iconCode" title="代码题" :description="codeDescription" @click="navigateProgram"></MainCard>
    </div>
    <div class="card history" @click="navigateHistory">
      <MainCard :image="iconHistory" title="历史记录" :description="historyDescription"></MainCard>
    </div>
    <div class="card hot-question">
      <HotQuestion />
    </div>
    <div class="card recent-record">
      <HistoryRecord />
    </div>
    <div class="card daily-recommendation" @click="navigateRecommend">
      <div class="daily-container">
        <div class="left-side">
          <img :src="iconRecommend" class="daily-icon" />
        </div>
        <div class="title">每日推荐</div>
        <div class="right-side">
          <ul class="features">
            <li>·采用AI算法为你量身定制</li>
            <li>·根据您的学习进度每日自动刷新</li>
            <li>·快来体验您的专属题单吧</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="card statistics">
      <div class="statistics-container">
        <div class="statistics-row">
          <div class="statistics-col-4">
            <img class="statistics-img" :src="iconDays" />
            <div class="statistics-text">连续打卡</div>
            <div class="statistics-number">{{ solveDays }}</div>
          </div>
          <div class="statistics-col-4">
            <div class="statistics-number">{{ solveQuestions }}</div>
            <div class="statistics-text">完成题目</div>

            <img class="statistics-img" :src="iconComplete" />
          </div>
        </div>
      </div>
    </div>
    <div class="card line-chart">
      <Echart />
    </div>
  </div>
</template>

<script setup>
import {ref,onMounted} from 'vue';
import MainCard from "@/views/person-study/components/MainCard.vue";
import iconSelect from "./images/select-question.png"
import iconCode from "./images/code-question.png"
import iconHistory from "./images/history.png"
import iconRecommend from "./images/daily-recommend.png"
import iconDays from "./images/days.png"
import iconComplete from "./images/complete-exercises.png"

import { useRouter } from 'vue-router'
import Echart from "./components/Echart.vue"
import HotQuestion from "./components/HotQuestion.vue"
import HistoryRecord from "./components/HistoryRecord.vue"
import { fetchPersonStudy } from './api/person-study';

//响应数据初始态 
const choiceDescription = ref('加载中...');
const codeDescription = ref('加载中...');
const historyDescription = ref('加载中...');
const solveDays = ref('加载中...');
const solveQuestions = ref('加载中...');

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
//TODO:合并筛选和历史记录
// function navigateHistory () {
//   router.push('/history')
// }
function navigateHistory () {
  router.push('/program/history')
} 

onMounted(async () => {
  try {
    const data = await fetchPersonStudy();
    choiceDescription.value = `共收录${data.selectNumber}道选择题`;
    codeDescription.value = `共收录${data.codeNumber}道代码题`;
    historyDescription.value = `共收录${data.solveQuestions}条历史记录`;
    solveDays.value = data.solveDays;
    solveQuestions.value = data.solveQuestions;
  } catch (error) {
    choiceDescription.value = '数据加载失败';
    codeDescription.value = '数据加载失败';
    historyDescription.value = '数据加载失败';
    solveDays.value = '数据加载失败';
    solveQuestions.value = '数据加载失败';
  }
});

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

.statistics {
  grid-column: span 7;
}

.line-chart {
  grid-column: span 15;
}


/* 每日推荐处 */
.daily-container {
  display: flex;
  height: 100%;
  width: 100%;
  justify-items: center;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.left-side {
  flex: 2;
  display: flex;
  justify-content: center;
}

.right-side {
  flex: 4.5;
}

.title {
  flex: 3;
  color: #ffffff;
  font-size: 40px;
}

.features {
  list-style: none;
  padding: 0;
  color: #ffffff;

}

.features li {
  margin-bottom: 5px;
  font-size: 17px;
}

.daily-icon {
  width: 6rem;
}

/* 每日推荐处 */



/* 数据统计处 */
.statistics-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  height: 100%;
}

.statistics-row {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.statistics-col-4 {
  display: flex;
  align-items: center;
  padding: 6px;
}

.statistics-img {
  width: 40px;

}

.statistics-text {
  font-size: 20px;
  color: #fff;
  margin: 7px;
}

.statistics-number {
  font-weight: bold;
  font-size: 30px;
  color: #ffffff;

}
</style>
