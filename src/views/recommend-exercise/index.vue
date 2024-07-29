<template>
    <search-filter @update:query="handleSearch"></search-filter>
    <div class="container">
        <div class="container-table">
			<div v-if="isLoading" class="loading-placeholder">
			Loading data...
			<!-- You can replace this with a spinner or any loading animation -->
			</div>
			<div v-else>
				<exercise-list v-if="!error" :questions="questions"></exercise-list>
				<p v-if="error" class="error-message">{{ error }}</p>
			</div>
		</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { questionRecommend } from './api/question_recommend';
import exerciseList from '@/components/exercise/exercise-list.vue';
import SearchFilter from '@/components/exercise/SearchFilter.vue';

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
const error = ref<string | null>(null); // Track error state

// Fetch data function
async function fetchData() {
    isLoading.value = true; // Set loading state while fetching data
    error.value = null; // Clear previous error message
    try {
        const response = await questionRecommend(10);
        questions.value = response.data.data;
    } catch (err) {
        console.error('Error fetching data:', err);
        error.value = 'Failed to fetch data'; // Update error message
    } finally {
        isLoading.value = false; // Ensure loading state is false when done
    }
}

// Call fetchData on component mount (initial load or refresh)
onMounted(() => {
    fetchData();
});

</script>

<style lang="scss" scoped>
.container {
    background-color: #f7f7f7;
	width:100%;
	display:flex;
}
.container-table{
	width:100%;
	justify-content:center;
	justify-items:center;
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

.error-message {
    color: red;
    font-size: 1.2rem;
    text-align: center;
}
</style>
