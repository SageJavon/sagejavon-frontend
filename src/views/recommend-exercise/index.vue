<template>
  <div class="full-height">
    <div class="container">
      <div class="container-table">
        <welcom @change-question="handleChangeQuestion"></welcom>
      </div>
      <!-- <div class="container-table"><search-filter @update:query="handleSearch"></search-filter></div> -->
      <div class="container-table">
        <div v-if="isLoading" class="loading-placeholder">
          Loading data...
          <!-- You can replace this with a spinner or any loading animation -->
        </div>
        <div v-else>
          <exercise-list v-if="!error" :questions="filteredQuestions"></exercise-list>
          <p v-if="error" class="error-message">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { questionRecommend } from './api/question_recommend'
import exerciseList from '@/components/exercise/exercise-list.vue'
import SearchFilter from '@/components/exercise/SearchFilter.vue'
import welcom from '@/components/exercise/recommd-welcom.vue'
import { questionChoice } from './api/question_choice'
import { questionProgram } from './api/question_program'

interface KnowledgeConcept {
  knowledgeId: number
  knowledge: string
}

interface Question {
  id: string
  questionText: string
  knowledgeConcept: KnowledgeConcept[]
  done: string
  difficulty: string
  type: number
}

const questions = ref<Question[]>([])
const filteredQuestions = ref<Question[]>([])
const isLoading = ref(false) // Track loading state
const error = ref<string | null>(null) // Track error state

function handleChangeQuestion(payload: any) {
  console.log('Received from child:', payload)
  fetchData()
}
function getRandomItems(array: Question[], count: number): Question[] {
  const shuffled = array.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Fetch data function
async function fetchData() {
  isLoading.value = true // Set loading state while fetching data
  error.value = null // Clear previous error message
  try {
    const response = await questionRecommend(10);
    questions.value = response.data.data;
    const query = {
      pageSize: 1,
      pageNum: 2,
      type: 1,
      difficultyOrder: 0
    };
    const response2 = await questionChoice(query);
    console.log(response2)
    const query2 = {
      pageNum: 1,
      pageSize: 1,
      type: 0,
      difficultyOrder: 0
    };
    const response1 = await questionProgram(query2);
    console.log(response1)

    if (questions.value === null) {
      filteredQuestions.value = response2.data.data.exerciseList;
      filteredQuestions.value = filteredQuestions.value.concat(response1.data.data.exerciseList);
    } else {
      // 筛选选择题和代码题
      const choiceQuestions = questions.value.filter((q) => q.type === 1);
      const codeQuestions = questions.value.filter((q) => q.type === 0);

      // 随机选择两道选择题和一道代码题
      const randomChoiceQuestions = getRandomItems(choiceQuestions, 2);
      const randomCodeQuestion = getRandomItems(codeQuestions, 1);

      // 处理没有选择题或代码题的情况
      if (randomChoiceQuestions.length === 0 && randomCodeQuestion.length === 0) {
        filteredQuestions.value = [];
      } else if (randomChoiceQuestions.length === 0) {
        filteredQuestions.value = randomCodeQuestion.concat(response2.data.data.exerciseList);
      } else if (randomCodeQuestion.length === 0) {
        filteredQuestions.value = randomChoiceQuestions.concat(response1.data.data.exerciseList);
      } else {
        // 合并并赋值给 filteredQuestions
        filteredQuestions.value = [...randomChoiceQuestions, ...randomCodeQuestion];
      }
    }

    console.log(response);
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = 'Failed to fetch data' // Update error message
  } finally {
    isLoading.value = false // Ensure loading state is false when done
  }
}

// Call fetchData on component mount (initial load or refresh)
onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.full-height {
  display: flex;
  justify-content: center;
  /* Center horizontally */
  align-items: center;
  /* Center vertically */
  flex-direction: column;
  /* Stack children vertically */
}

.error-message {
  color: red;
  font-size: 1.2rem;
  text-align: center;
}

.container-table {}

.container {
  flex: 1;
  /* Take remaining space */
  justify-content: center;
  /* Center content horizontally */
  align-items: center;
  /* Center content vertically */
}

.sticky-pagination {
  position: sticky;
  bottom: 0;
  width: 100%;
  background-color: #f7f7f7;
  padding: 10px 20px;
  z-index: 1000;
  display: flex;
  justify-content: center;
  /* Ensure pagination is above other content */
}

.loading-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  /* Adjust height based on your design */
  font-size: 1.5rem;
  color: #555;
  /* Placeholder text color */
}
</style>
