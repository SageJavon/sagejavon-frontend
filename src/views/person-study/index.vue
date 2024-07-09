<template>
  <div class="person-study-page">
    <div style="width: 120px; height: 100vh; background-color: var(--theme-blue);"></div>
    <div class="person-study-container">
      <div class="card choice-question"></div>
      <div class="card code-question"></div>
      <div class="card history"></div>
      <div class="card hot-question"></div>
      <div class="card recent-record"></div>
      <div class="card daily-recommendation"></div>
      <div class="card statistics"></div>
      <div class="card line-chart"></div>
    </div>
  </div>
</template>

<script setup>

</script>

<style>
* {
  --theme-blue: #052350;
  --card-radius: 16px;
}

.person-study-page {
  width: 100%;
  height: 100vh;
  display: flex;
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
  background-color: var(--theme-blue);
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
}

.statistics {
  grid-column: span 7;
}

.line-chart {
  grid-column: span 15;
}
</style>
