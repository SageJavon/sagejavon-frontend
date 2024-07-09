<template>
  <div class="main-card">
    <img class="icon" :src="image" alt="image">
    <div class="main-card-content">
      <h2 class="title">{{ title }}</h2>
      <p class="description">{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
import defaultImage from '../images/code-question.png'

defineProps({
  image: {
    type: String,
    default: defaultImage
  },
  title: {
    type: String,
    default: '代码题'
  },
  description: {
    type: String,
    default: '共收录1,200道题目'
  }
})
</script>

<style>
* {
  font-size: 16px;
  --icon-size: 7rem;
  --main-card-title-font-size: 3rem;
  --main-card-description-font-size: 1.2rem;
}

.main-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
}

.icon {
  width: var(--icon-size);
  height: var(--icon-size);
  transform: skew(0, -16deg);
}

.main-card-content {
  row-gap: 12px;
}

.main-card-content .title {
  font-size: var(--main-card-title-font-size);
  font-weight: 500;
  color: white;
}

.main-card-content .description {
  font-size: var(--main-card-description-font-size);
  font-weight: 300;
  color: white;
}
</style>