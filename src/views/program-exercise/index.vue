<template>
	<div class="container">
		<exercise-list :questions="questions"></exercise-list>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import exerciseList from '@/components/exercise/exercise-list.vue';

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

const questions = ref<Question[]>([
	{
		id: 'C1', questionText: '你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界', knowledgeConcept: [{
			knowledgeId: 0,
			"knowledge": "java"
		}, {
			knowledgeId: 0,
			"knowledge": "java"
		}, {
			knowledgeId: 0,
			"knowledge": "java"
		}], done: '完成', difficulty: 'SS', type: 0
	},
	{
		id: 'C1', questionText: '你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界', knowledgeConcept: [{
			knowledgeId: 0,
			"knowledge": "java"
		}], done: '完成', difficulty: 'SS', type: 0
	},
	{
		id: 'C1', questionText: '你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界', knowledgeConcept: [{
			knowledgeId: 0,
			"knowledge": "java"
		}], done: '完成', difficulty: 'SS', type: 0
	},
	{
		id: 'C1', questionText: '你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界', knowledgeConcept: [{
			knowledgeId: 0,
			"knowledge": "java"
		}], done: '完成', difficulty: 'SS', type: 1
	},
]);
</script>


<style lang="scss">
.container {
	background-color: #f7f7f7;
	position: absolute;
	/* 将图表定位到页面的左上角 */
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	margin: 0;
	/* 移除外边距 */
	width: 100%;
	/* 设置宽度为100% */
	height: 100%;
	/* 设置高度为100% */
}
</style>