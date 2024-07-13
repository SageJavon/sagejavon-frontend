<template>
	<div class="container">
		<div v-if="isLoading" class="loading-placeholder">
			Loading data...
			<!-- You can replace this with a spinner or any loading animation -->
		</div>
		<div v-else>
			<exercise-list :questions="questions"></exercise-list>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import exerciseList from '@/components/exercise/exercise-list.vue';
import { questionRecommend } from './api/question_recommend';

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

onMounted(async () => {
	await fetchData(); // Fetch initial data
});

async function fetchData() {
	isLoading.value = true; // Set loading state while fetching data
	try {
		const res = await questionRecommend(10); // Fetch data
		if (res.status === 200) {
			questions.value = res.data.data; // Update questions with fetched data
		} else {
			// Handle update failure
		}
	} catch (err) {
		console.error('Failed to fetch recommended questions:', err);
		// Handle error as needed
	} finally {
		isLoading.value = false; // Reset loading state
	}
}
</script>

<style lang="scss">
.container {
	background-color: #f7f7f7;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	margin: 0;
	width: 100%;
	height: 100%;
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
