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
            <div class="statistics-number">223</div>
          </div>
          <div class="statistics-col-4">
            <div class="statistics-number">369</div>
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
import MainCard from "@/views/person-study/components/MainCard.vue";
import iconSelect from "./images/select-question.png"
import iconCode from "./images/code-question.png"
import iconHistory from "./images/history.png"
import iconRecommend from "./images/daily-recommend.png"
import iconDays from "./images/days.png"
import iconComplete from "./images/complete-exercises.png"

import { useRouter } from 'vue-router'
import Echart from "./components/Echart.vue"
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
  height:100%;
}

.statistics-row {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.statistics-col-4 {
  display:flex;
  align-items: center;
  padding:6px;
}

.statistics-img{
  width:40px;

}

.statistics-text {
  font-size:20px;
  color: #fff;
  margin:7px;
}

.statistics-number {
  font-weight: bold;
  font-size:30px;
  color: #ffffff;

}
</style>
