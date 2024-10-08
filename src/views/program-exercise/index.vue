<template>
	<div class="full-height">
		<div class="container">
		<div v-if="isLoading" class="loading-placeholder">
			Loading data...
			<!-- You can replace this with a spinner or any loading animation -->
		</div>
		<div v-else>
			<exercise-list :questions="questions"></exercise-list>
		</div>
	</div>
	<div class="sticky-pagination" v-if="!isLoading && questions.length > 0">
		<n-pagination v-model:page="currentPage" :page-count="totalPages" show-quick-jumper
			@update:page="handlePaginationChange"></n-pagination>
	</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import exerciseList from '@/components/exercise/exercise-list.vue';
import { questionProgram } from './api/question_program';
import { NPagination } from 'naive-ui';

interface KnowledgeConcept {
	knowledgeId: number;
	knowledge: string;
}

interface Question {
	id: string;
	questionText: string;
	knowledgeConcept: KnowledgeConcept[];
	done: string;
	difficulty: string;
	type: number;
}

const questions = ref<Question[]>([]);
const isLoading = ref(false); // Track loading state

const currentPage = ref(1);
const pageSize = 10; // Adjust as per your pagination needs

onMounted(async () => {
	await fetchData(currentPage.value); // Fetch initial data based on currentPage
});

async function fetchData(pageNum: number) {
	isLoading.value = true; // Set loading state while fetching data
	try {
		const query = {
			pageNum,
			pageSize,
			type: 0,
			difficultyOrder: 0
		};
		const response = await questionProgram(query);
		questions.value = response.data.data.exerciseList; // Update questions with fetched data
		currentPage.value = pageNum; // Update current page
	} catch (error) {
		console.error('Error fetching questions:', error);
		// Handle error as needed (e.g., show error message to user)
	} finally {
		isLoading.value = false; // Reset loading state
	}
}

function handlePaginationChange(pageNum: number) {
	fetchData(pageNum); // Trigger fetchData when pagination changes
}

// Computed property for total pages
const totalPages = computed(() => 11);

</script>



<style lang="scss" scoped>
.full-height {
  height: 100vh; /* Ensure full viewport height */
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  flex-direction: column; /* Stack children vertically */
}

.container {
  flex: 1; /* Take remaining space */
  padding: 20px;
  width: 100vw;
  display: flex;
  justify-content: center; /* Center content horizontally */
  align-items: center; /* Center content vertically */
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
  height: 200px; /* Adjust height based on your design */
  font-size: 1.5rem;
  color: #555; /* Placeholder text color */
}
</style>

