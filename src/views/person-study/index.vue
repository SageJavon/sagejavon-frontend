<template>
  <div class="person-study-container">
    <div class="card choice-question">
      <MainCard :image="iconSelect" title="选择题"></MainCard>
    </div>
    <div class="card code-question">
      <MainCard :image="iconCode" title="代码题"></MainCard>
    </div>
    <div class="card history">
      <MainCard :image="iconHistory" title="历史记录"></MainCard>
    </div>
    <div class="card hot-question"></div>
    <div class="card recent-record"></div>
    <div class="card daily-recommendation"></div>
    <div class="card statistics"></div>
    <div class="card line-chart"></div>
  </div>
</template>

<script setup>
import MainCard from "@/views/person-study/components/MainCard.vue";
import iconSelect from "./images/select-question.png"
import iconCode from "./images/code-question.png"
import iconHistory from "./images/history.png"

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
</style>
