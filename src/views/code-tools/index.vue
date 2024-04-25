<template>
  <n-row class="editor-container">
    <n-col span="12">
      <div class="editor" ref="dom"></div>
    </n-col>
    <n-col span="12">
      <n-card title="输出">
        <template #header-extra>
          <n-button-group>
            <n-button @click="handleApiCall(3)">点击修复</n-button>
            <n-button @click="handleApiCall(4)">点击解释</n-button>
            <n-button @click="handleApiCall(2)">风格评估</n-button>
          </n-button-group>
        </template>
        <n-input v-model:value="apiOutput" type="textarea" class="output" placeholder="大模型输出" />
      </n-card>
    </n-col>
  </n-row>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, defineProps, defineEmits, ref, reactive } from 'vue';
import * as monaco from 'monaco-editor';
import { editor as MonacoEditor } from 'monaco-editor';
import { NRow, NCol, NCard, NButton, NInput } from 'naive-ui';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const dom = ref<HTMLDivElement | null>(null);

let instance: MonacoEditor.IStandaloneCodeEditor | undefined;

const apiOutput = ref(''); // Ref to hold API response

onMounted(() => {
  if (dom.value) {
    const modelUri = monaco.Uri.parse('java://grid/settings.java');
    let model = monaco.editor.getModel(modelUri);
    if (!model) {
      model = monaco.editor.createModel(
        props.modelValue,
        'java',
        modelUri
      );
    } else {
      model.setValue(props.modelValue);
    }
    instance = monaco.editor.create(dom.value, {
      model: model,
      tabSize: 2,
      automaticLayout: true,
      scrollBeyondLastLine: false,
    });
    instance.onDidChangeModelContent(() => {
      const value = instance?.getValue() ?? '';
      emit('update:modelValue', value);
    });
  }
});

onBeforeUnmount(() => {
  instance?.dispose();
  monaco.editor.getModels().forEach(model => model.dispose());
});

// Replace 'apiEndpoint' with your actual API endpoint
const apiEndpoint = 'https://89e265v638.vicp.fun:443/aixcoder';

// Function to handle API calls
async function handleApiCall(action: string) {
  try {
    const codeContent = instance?.getValue();
    if (codeContent) {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers if needed
        },
				body: JSON.stringify({
					"mode":action,
					"content":codeContent
				 })
      });
      const data = await response.json();
      apiOutput.value = data.result; // Assuming 'data.result' holds the API response
		}

		console.log(action)
		// apiOutput.value=action+codeContent
  } catch (error) {
    console.error('API call failed:', error);
    apiOutput.value = 'Error calling API';
  }
}
</script>

<style scoped>
.editor-container {
  display: flex;
  height: 100%;
}
.editor {
  height: 100%;
  border: 1px solid #000000;
}
.output {
  height: 100%;
  border: 1px solid #000000;
}
</style>
