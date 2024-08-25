<template>
  <div v-if="show" class="floating-box">
    <div class="content">
      <h3>问卷调查</h3>
      <p v-if="props.index===0">我们希望了解你对于Java课程知识问答模块的评估和建议。点击下方按钮参与问卷。</p>
      <p v-if="props.index===1">我们希望了解你对于Java自适应学习模块的评估和建议。点击下方按钮参与问卷。</p>
      <p v-if="props.index===2">我们希望了解你对于大模型评分模块的评估和建议。点击下方按钮参与问卷。</p>
      <p v-if="props.index===3">我们希望了解你对于编程导师模块的评估和建议。点击下方按钮参与问卷。</p>
      <button @click="openModal">参与问卷</button>
      <button @click="handleClose" class="close-btn">×</button>
    </div>
    <!-- 模态框 -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>问卷调查</h2>
        <p>请填写以下问卷以帮助我们改进服务：</p>
        <iframe :src="iframeSrc" width='560' height='600' frameborder='0' style='overflow:auto'></iframe>
        <button @click="closeModal" class="modal-close-btn">关闭</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps } from 'vue';

// 定义 props 接收 index 参数
const props = defineProps<{
  index: number;
}>();

const show = ref(true);
const isModalOpen = ref(false);

// 计算 iframe 的 src
const iframeSrc = computed(() => {
  // 根据 index 参数生成 iframe src
  // 这里假设不同 index 对应不同的 URL
  const baseUrls = [
    'https://www.wjx.cn/vm/PBcmk6d.aspx?width=750&source=iframe&s=t', // index 0
    'https://www.wjx.cn/vm/P7HaK0m.aspx?width=750&source=iframe&s=t', // index 1
    'https://www.wjx.cn/vm/mouLxO3.aspx?width=750&source=iframe&s=t', // index 2
    'https://www.wjx.cn/vm/eLDkbEY.aspx?width=750&source=iframe&s=t'
    // 根据实际情况添加更多的 URL
  ];
  return baseUrls[props.index] || baseUrls[0]; // 默认返回第一个 URL
});

const handleClose = () => {
  show.value = false;
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<style scoped>
  .floating-box {
    position: fixed;
    bottom: 100px;  
    right: 20px;
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    width: 300px;
    font-family: Arial, sans-serif;
  }
  
  .floating-box .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  
  .floating-box h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }
  
  .floating-box p {
    margin: 10px 0;
    color: #666;
    text-align: center;
  }
  
  .floating-box button {
    background-color: #007bff;
    border: none;
    color: white;
    padding: 5px 10px;
    margin: 5px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  .floating-box button:hover {
    background-color: #0056b3;
  }
  
  .floating-box .close-btn {
    background: transparent;
    color: #999;
    font-size: 24px;
    position: absolute;
    top: 0px;
    right: 10px;
    cursor: pointer;
  }
  
  .floating-box .close-btn:hover {
    color: #333;
  }
  
  /* 模态框样式 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
  }
  
  .modal-content {
    background: white;
    border-radius: 8px;
    padding: 20px;
    width: 700px;
    max-width: 600px;
    position: relative;
  }
  
  .modal-content h2 {
    margin-top: 0;
    font-size: 24px;
  }
  
  .modal-content iframe {
    border: none;
    margin-top: 20px;
  }
  
  .modal-close-btn {
    background-color: #007bff;
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
  
  .modal-close-btn:hover {
    background-color: #0056b3;
  }
  </style>