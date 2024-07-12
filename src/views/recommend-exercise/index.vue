<template>
	<div class="container">
		<h1>代码题练习</h1>
		<exercise-list :questions="questions"></exercise-list>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import exerciseList from '@/components/exercise/exercise-list.vue';

interface Question {
	id: string;
	name: string;
	knowledgePoints: string[];
	status: string;
	difficulty: string;
}

const questions = ref<Question[]>([
	{ id: 'C1', name: '你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界你好世界', knowledgePoints: ['某知识点某知识点', '某知识点'], status: '完成', difficulty: 'SS' },
	{ id: 'C2', name: '你好世界', knowledgePoints: ['某知识点点点点点'], status: '完成', difficulty: 'A' },
	{ id: 'C3', name: '你好世界', knowledgePoints: ['某知识点'], status: '完成', difficulty: 'B' },
	{ id: 'C4', name: '你好世界', knowledgePoints: ['某知识点点点点点'], status: '完成', difficulty: 'C' },
	{ id: 'C5', name: '你好世界', knowledgePoints: ['某知识点', '某知识点'], status: '未完成', difficulty: 'SS' },
	{ id: 'C6', name: '你好世界', knowledgePoints: ['某知识点点点点点'], status: '完成', difficulty: 'A' },
	{ id: 'C7', name: '你好世界', knowledgePoints: ['某知识点点点点点'], status: '完成', difficulty: 'A' },
	{ id: 'C8', name: '你好世界', knowledgePoints: ['某知识点点点点点'], status: '完成', difficulty: 'A' },
	{ id: 'C8', name: '你好世界', knowledgePoints: ['某知识点点点点点'], status: '完成', difficulty: 'A' },
	{ id: 'C8', name: '你好世界', knowledgePoints: ['某知识点点点点点'], status: '完成', difficulty: 'A' },
	{ id: 'C8', name: '你好世界', knowledgePoints: ['某知识点点点点点'], status: '完成', difficulty: 'A' },
	{ id: 'C8', name: '你好世界', knowledgePoints: ['某知识点点点点点'], status: '完成', difficulty: 'A' },
	{ id: 'C8', name: '你好世界', knowledgePoints: ['某知识点点点点点'], status: '完成', difficulty: 'A' },
	{ id: 'C8', name: '你好世界', knowledgePoints: ['某知识点点点点点'], status: '完成', difficulty: 'A' },
	{ id: 'C8', name: '你好世界', knowledgePoints: ['某知识点点点点点'], status: '完成', difficulty: 'A' },
	{ id: 'C8', name: '你好世界', knowledgePoints: ['某知识点点点点点'], status: '完成', difficulty: 'A' },
	{ id: 'C8', name: '你好世界', knowledgePoints: ['某知识点点点点点'], status: '完成', difficulty: 'A' },
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