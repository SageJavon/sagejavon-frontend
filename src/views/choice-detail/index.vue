<template>
	<div class="container">
		<div class="sidebar">
			<div class="tabs">
				<div class="circle-flex">
					<div class="circle"></div>
					<div @click="activeTab = 'content'" :class="{ active: activeTab === 'content' }">题目内容</div>
				</div>
				<div class="circle-flex">
					<div class="circle"></div>
					<div @click="activeTab = 'history'" :class="{ active: activeTab === 'history' }">历史记录</div>
				</div>
				<div class="circle-flex">
					<div class="circle"></div>
					<div @click="activeTab = 'solution'" :class="{ active: activeTab === 'solution' }">正确题解</div>
				</div>
			</div>
			<div class="content">
				<div v-if="activeTab === 'content'">
					<div class="program-content">
						<div class="sub-section">
							<span class="tag">{{ choiceDetail.difficulty }}</span>
							<span class="knowledge-point" v-for="(knowledge, index) in choiceDetail.knowledgeConcept">
								<i class="icon-tag">
								</i> {{ knowledge.knowledge }}
							</span>
						</div>
						<v-md-preview :text="choiceDetail.questionText"></v-md-preview>
						<div class="choices">
							<div class="choices-item" @click="submitChoice('A')"><span class="option">A.</span> {{
								choiceDetail.choiceA }}</div>
							<div @click="submitChoice('B')" class=" choices-item"><span class="option">B.</span> {{
								choiceDetail.choiceB }}</div>
							<div @click="submitChoice('C')" class=" choices-item"><span class="option">C.</span> {{
								choiceDetail.choiceC }}</div>
							<div @click="submitChoice('D')" class=" choices-item"><span class="option">D.</span> {{
								choiceDetail.choiceD }}</div>
						</div>

					</div>
				</div>
				<div v-if="activeTab === 'history'">
					<p>这里显示历史记录...</p>
				</div>
				<div v-if="activeTab === 'solution'">
					<p>这里显示正确题解...</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { choiceDetails } from './api/choice_detail';
const route = useRoute()
const questionId = ref(route.query.id)
console.log(questionId.value)

const language = ref('java')
const editorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => {
	console.log('editor实例加载完成', editor)
}

const activeTab = ref('content');


export interface Choice {
	choiceA: string;
	choiceB: string;
	choiceC: string;
	choiceD: string;
	difficulty: number;
	/**
	 * 选择题id
	 */
	id: number;
	knowledgeConcept: KnowledgeConcept[];
	questionText: string;
}

export interface KnowledgeConcept {
	knowledge: string;
	knowledgeId: number;
}

const choiceDetail = ref<Choice>({});
const getChoiceDetail = async () => {
	// localStorage.removeItem('chatStorage')

	try {
		const res = await choiceDetails(questionId.value) // 假设 chatList 是一个异步请求函数
		if (res.status === 200) {
			console.log(res)
			choiceDetail.value = res.data.data
		}
		else {
			// 更新失败
		}
	}
	catch (err) {
		console.error('获取推荐列表失败:', err)
	}
}
getChoiceDetail()



function submitChoice(choice: string) {
	console.log('提交选择:', choice);
}

</script>

<style scoped>
.container {
	display: flex;
	padding: 20px;
	/* Add padding to container */
	height: 100vh;
	/* Adjust the height to make the container full height */
	justify-content: space-between;
	overflow: hidden;
	/* Hide overflow to avoid scrollbars */
	gap: 20px;
	/* Add gap between sidebar and main */
}

.sidebar {
	flex: 2;
	border: 1px solid #f2f1f1;
	height: 100%;
	overflow: auto;
	border-radius: 10px;
	/* Enable scrolling for the sidebar */
	/* Add padding inside the sidebar */
}

.main {
	border-radius: 10px;
	flex: 1;
	background-color: #fff;
	justify-content: center;
	align-items: center;
	border: 1px solid #f2f1f1;
	/* Add padding inside the main content */
}

.editor {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #d3d1d1;
}

.circle {
	width: 20px;
	height: 20px;
	background-color: #d6d3d3;
	border-radius: 100%
}

.circle-flex {
	display: flex;
	justify-items: center;
	justify-content: center;
	align-items: center;
	line-height: 1.4;
	margin-left: 10px;
}

.tabs {
	height: 35px;
	display: flex;
	margin-bottom: 20px;
	justify-content: left;
	background-color: #f2f1f1
}

.tabs div {
	padding: 5px;
	cursor: pointer;
}

.tabs-two {
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	height: 35px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #f2f1f1
}

.tabs-two button {
	flex: 1;
	padding: 5px;
}

.tabs div {
	transition: background-color 0.3s;
	color: #aaa;
}

.tabs div.active {
	color: black;
}

.tabs div:not(:last-child) {
	border-right: none;
}

.code-block {}

.sub-section {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-left: 20px;
	/* Adds space between the two elements */
}

.tag {
	background-color: #f5f5f5;
	color: rgb(214, 62, 62);
	padding: 5px 10px;
	border-radius: 15px;
	font-weight: bold;
}

.knowledge-point {
	display: flex;
	align-items: center;
	background-color: #f5f5f5;
	padding: 5px 10px;
	border-radius: 15px;
	color: #666;
	font-weight: bold;
}

.icon-tag {
	display: inline-block;
	width: 1em;
	height: 1em;
	margin-right: 5px;
	background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23666" d="M21.41 11.58l-9-9A2 2 0 0010.34 2H4a2 2 0 00-2 2v6.34a2 2 0 00.58 1.42l9 9a2 2 0 002.83 0l6.34-6.34a2 2 0 000-2.83zM6.5 8.5A1.5 1.5 0 118 7a1.5 1.5 0 01-1.5 1.5z"/></svg>') no-repeat center center;
	background-size: contain;
}

.choices {
	margin-left: 30px
}

.choices-item {
	margin-top: 10px;
}

.choices-item:hover {

	background-color: #f2f1f1;
	padding: 10px;

}

.option {
	font-weight: 600;
	margin-right: 10px;
}
</style>
