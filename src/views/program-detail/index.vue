<template>
	<div class="full-height">
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
							<span class="tag">{{ programDetail.difficulty }}</span>
							<span class="knowledge-point" v-for="(knowledge, index) in programDetail.knowledgeConcept">
								<i class="icon-tag">
								</i> {{ knowledge.knowledge }}
							</span>
						</div>
						<pre class="code-block">
              <v-md-preview :text="programDetail.questionText"></v-md-preview>
            </pre>
					</div>
				</div>
				<div v-if="activeTab === 'history'">
					<div v-if="records.length!=0"><history-list :records="records"></history-list></div>
					<div v-else>还没有答题记录</div>
				</div>
				<div v-if="activeTab === 'solution'">
					<monaco-editor v-model="correct" :language="language" width="100%" height="500px"
					@editor-mounted="editorMounted"></monaco-editor>
				</div>
			</div>
		</div>
		<div class="main">
			<div class="tabs-two">
				<div class="circle-flex">
					<div class="circle"></div>
					<button @click="activeTab = 'content'" :class="{ active: activeTab === 'content' }">代码</button>
				</div>
			</div>
			<div class="editor">
				<monacoEditor v-model="code" :language="language" width="100%" height="100%"
					@editor-mounted="editorMounted"></monacoEditor>

			</div>
			<NButton v-if="!isLoading" style="width:100%;margin-top:5px" type="primary" @click="submitCode">提交代码
			</NButton>
			<NButton v-if="isLoading" style="width:100%;margin-top:5px" type="info" disabled>正在评分中...
			</NButton>
		</div>
		<!-- <DragBall /> -->

		<NModal v-model:show="showModal" class="custom-card" preset="card" :style="bodyStyle" :title="'您的得分为:' + score"
			size="huge" :bordered="false" :segmented="segmented">
			正确答案：
			{{ correctAnswer==null?'暂无':correctAnswer }}
			<v-md-preview :text="suggestion"></v-md-preview>
		</NModal>
	</div>
	</div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';
import * as monaco from 'monaco-editor'
import monacoEditor from './components/monacoEditor.vue';
import DragBall from './components/DragBall.vue'
import { useRoute } from 'vue-router';
import { programDetails } from './api/program_detail';
import { NButton, NModal } from 'naive-ui';
import { questionCode } from './api/question_code';
import ModalDialog from './components/ModalDialog.vue'
import historyList from '@/components/exercise/history-list.vue';
import {recordList} from './api/record_list'
import {codeRecordDetail} from '@/components/exercise/api/code_record_detail';
const bodyStyle = ref({
	width: '700px',
})
const segmented = ref({
	content: 'soft',
	footer: 'soft'
})
const showModal = ref(false)


const route = useRoute()
const questionId = ref(route.query.id)
console.log(questionId.value)

const language = ref('java')
const editorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => {
	console.log('editor实例加载完成', editor)
}


interface KnowledgeConcept {
	knowledgeId: number;
	knowledge: string;
}


export interface ExerciseRecordList {
	difficulty: number;
	exerciseId: number;
	knowledgeConcept: KnowledgeConcept[];
	questionText: string;
	recordId: number;
	score: number;
	submitTime: string;
	type: number;
}

const records = ref<ExerciseRecordList[]>([]);
const correctAnswer=ref("")
const correct=ref("")
// const response = await recordList(Number(questionId.value));
// console.log(response)
// records.value = response.data.data
// console.log(records.value)

onMounted(()=>{
	recordList(questionId.value).then((res)=>{
		console.log(res)
		records.value=res.data.data
	})

	// 获取正确答案
	codeRecordDetail(questionId.value)
		.then((response) => {
			correct.value=response.data.data.correctAnswer

		})
		.catch((error) => {
			console.error('提交失败:', error);
			// Handle error
		});
})

export interface Program {
	difficulty: number;
	/**
	 * 题目id
	 */
	id: number;
	knowledgeConcept: KnowledgeConcept[];
	/**
	 * 题目内容
	 */
	questionText: string;
}

export interface KnowledgeConcept {
	/**
	 * 知识点
	 */
	knowledge: string;
	/**
	 * 知识点id
	 */
	knowledgeId: number;
}

const getProgramDetail = async () => {
	// localStorage.removeItem('chatStorage')

	try {
		const res = await programDetails(questionId.value) // 假设 chatList 是一个异步请求函数
		if (res.status === 200) {
			programDetail.value = res.data.data
		}
		else {
			// 更新失败
		}
	}
	catch (err) {
		console.error('获取推荐列表失败:', err)
	}
}
getProgramDetail()

const programDetail = ref<Program>({});


const activeTab = ref('content');

const code = ref("")

const score = ref(0)

const suggestion = ref("")

const isLoading = ref(false)

const submitNum=ref(0)

function submitCode(choice: string) {
	isLoading.value = true
	submitNum.value+=1
	const request = {
		id: questionId.value,
		answer: code.value,
		submitNum: submitNum.value
	};
	console.log(request)

	questionCode(request)
		.then((response) => {
			console.log('提交成功:', response.data);
			score.value = response.data.data.score
			// suggestion.value = response.data.data.suggestion
			console.log(response.data.data)
			suggestion.value = response.data.data.suggestion
			correctAnswer.value = response.data.data.correctAnswer
			showModal.value = true
			isLoading.value = false

		})
		.catch((error) => {
			console.error('提交失败:', error);
			// Handle error
		});
}
</script>

<style scoped>

.full-height {
  height: 100vh; /* Ensure full viewport height */
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  flex-direction: column; /* Stack children vertically */
  background-color: #F7F7F7;
}
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
	height: 90%;
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
</style>
