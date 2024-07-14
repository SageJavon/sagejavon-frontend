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
					<p>这里显示历史记录...</p>
				</div>
				<div v-if="activeTab === 'solution'">
					<p>这里显示正确题解...</p>
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
			<NButton style="width:100%;margin-top:5px" type="primary" @click="submitCode">提交代码</NButton>
		</div>
		<!-- <DragBall /> -->

		<NModal v-model:show="showModal" class="custom-card" preset="card" :style="bodyStyle" :title="'您的得分为:' + score"
			size="huge" :bordered="false" :segmented="segmented">
			<v-md-preview :text="suggestion"></v-md-preview>
		</NModal>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as monaco from 'monaco-editor'
import monacoEditor from './components/monacoEditor.vue';
import DragBall from './components/DragBall.vue'
import { useRoute } from 'vue-router';
import { programDetails } from './api/program_detail';
import { NButton, NModal } from 'naive-ui';
import { questionCode } from './api/question_code';
import ModalDialog from './components/ModalDialog.vue'


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
			console.log(res)
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

function submitCode(choice: string) {
	const request = {
		id: questionId.value,
		answer: code.value,
		submitNum: 1
	};

	questionCode(request)
		.then((response) => {
			console.log('提交成功:', response.data);
			score.value = response.data.data.score
			// suggestion.value = response.data.data.suggestion
			suggestion.value = `

## 学习建议
- **理解基础概念：**
  - 确保理解变量的概念，如何声明和使用。
  - 理解赋值语句和表达式的执行顺序。

- **掌握基本语法：**
  - 熟悉 Java 中的数据类型（如 int）、运算符和基本语句（如 if、for、while）。

- **学习调试技巧：**
  - 学会使用断点和调试器来逐步执行代码，观察变量的变化和程序的执行流程，这样可以更清晰地理解代码的运行过程。

- **加强对控制流的理解：**
  - 练习使用条件语句（if-else）、循环语句（for、while）等，控制程序的流程和逻辑。

- **尝试更复杂的示例和项目：**
  - 通过解决问题或实现小项目来应用所学知识，这有助于加深理解和掌握编程技能。

## 学习资源推荐：
- **网上课程和教程：**
  - Coursera 和 edX 等平台上有很多优秀的计算机科学课程，可以免费学习或付费学习。
  - Oracle 官方文档：Java 编程语言的官方文档提供了详尽的学习资料和示例。

- **书籍：**
  - 《Thinking in Java》 by Bruce Eckel：这本书被认为是入门 Java 编程的经典之作，适合初学者阅读。
  - 《Effective Java》 by Joshua Bloch：虽然更适合有一定经验的开发人员，但对理解 Java 语言的特性和最佳实践也非常有帮助。

- **在线资源：**
  - Stack Overflow：一个社区驱动的问答网站，可以在这里找到关于 Java 编程的各种问题和解答。
  - GitHub：浏览开源项目的代码库，了解其他开发者是如何使用 Java 的。

- **练习平台：**
  - LeetCode、HackerRank 等在线编程练习平台提供了大量的编程题目和挑战，适合练习算法和数据结构的应用。

总结：
通过深入学习和练习，结合有效的学习资源和平台，这位学生可以逐步提升他的 Java 编程技能。重要的是保持耐心和持续的学习态度，编程技能是通过不断练习和实践来提升的！

			`
			showModal.value = true

		})
		.catch((error) => {
			console.error('提交失败:', error);
			// Handle error
		});
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
