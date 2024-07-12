<template>
	<div class="container">
		<div class="question-list">
			<table class="table-class">
				<thead>
					<tr>
						<th>题目编号</th>
						<th>题目名称</th>
						<th>知识点</th>
						<th>状态</th>
						<th>难度</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(question, index) in questions" :key="question.id">
						<td class="text-ellipsis">{{ question.id }}</td>
						<td class="text-ellipsis">{{ question.name }}</td>
						<td class="knowledge-container">
							<div v-for="point in question.knowledgePoints" :key="point"
								class="knowledge-point text-ellipsis">
								{{ point }}
							</div>
						</td>
						<td>
							<span :class="statusClass(question.status)"></span>
						</td>
						<td :class="difficultyClass(question.difficulty)" class="difficulty text-ellipsis">
							{{ question.difficulty }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

interface Question {
	id: string;
	name: string;
	knowledgePoints: string[];
	status: string;
	difficulty: string;
}

const props = defineProps<{ questions: Question[] }>();

const statusClass = (status: string) => {
	return status === '完成' ? 'status-complete' : 'status-pending';
};

const difficultyClass = (difficulty: string) => {
	switch (difficulty) {
		case 'SS':
			return 'difficulty-ss';
		case 'A':
			return 'difficulty-a';
		case 'B':
			return 'difficulty-b';
		case 'C':
			return 'difficulty-c';
		default:
			return '';
	}
};
</script>

<style scoped>
.container {
	width: 100%;
	display: flex;
	justify-content: center;
	margin-top: 20px;
}

.question-list {
	width: 90%;
}

.question-list table {
	width: 100%;
	border-collapse: collapse;
	border-radius: 10px;
	overflow: hidden;
	background-color: #ffffff;
	box-shadow: 4px 4px 16px 0px #00000014;
}

.question-list th,
.question-list td {
	padding: 8px;
	text-align: center;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.question-list th {
	border-bottom: 2px solid #ddd;
}

.question-list tbody tr:hover {
	background-color: #f5f5f5;
}

.first-row td {
	border-bottom: 1px solid #ddd;
}

.knowledge-container {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}

.knowledge-point {
	background-color: #f0f0f0;
	padding: 2px 4px;
	margin: 2px;
	display: inline-block;
	border-radius: 4px;
	max-width: 100px;
}

.status-complete {
	width: 24px;
	height: 24px;
	background-color: green;
	border-radius: 50%;
	display: inline-block;
	position: relative;
}

.status-complete:after {
	content: '';
	width: 5px;
	height: 10px;
	border: solid white;
	border-width: 0 2px 2px 0;
	display: inline-block;
	position: absolute;
	top: 5px;
	left: 9.5px;
	transform: rotate(45deg);
}

.status-pending {
	width: 24px;
	height: 24px;
	border: 2px solid green;
	border-radius: 50%;
	display: inline-block;
}

.difficulty-ss {
	color: red;
	font-weight: bold;
}

.difficulty-a {
	color: orange;
	font-weight: bold;
}

.difficulty-b {
	color: blue;
	font-weight: bold;
}

.difficulty-c {
	color: green;
	font-weight: bold;
}

.status {
	font-size: 20px;
	color: #00aaff;
}

.difficulty {
	font-size: 18px;
}

.text-ellipsis {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 100px;
}
</style>
