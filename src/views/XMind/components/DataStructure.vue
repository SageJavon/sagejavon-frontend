<script lang="ts">
import { defineComponent, ref } from 'vue'
import DataStructureItem from './DataStructureItem.vue'

export default defineComponent({
  components: { DataStructureItem },
  setup(_props, context) {
    const dataList = ref([])

    function closeModal() {
      context.emit('close')
    }

    function setDataList(data) {
      dataList.value = data
    }

    return {
      dataList,
      closeModal,
      setDataList,
    }
  },
})
</script>

<template>
  <div class="xmind-data-structure-tree">
    <div class="structure-title">
      <p>数据大纲</p>
      <i class="ri-close-fill" @click="closeModal" />
    </div>
    <div class="structure-content">
      <div class="structure-content-scroll">
        <DataStructureItem
          :depth="0"
          :data-list="dataList"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less">
.xmind-data-structure-tree {
  position: fixed;
  z-index: 999;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: 0px 0px 18px 5px rgba(0,0,0,0.1);
  .structure-title {
    height: 42px;
    border-bottom: 1px solid #f1f1f1;
    display: flex;
    align-items: center;
    padding: 0 12px;
    justify-content: space-between;
    p {
      color: #000;
      font-size: 14px;
    }
    i {
      color: #4c4c4c;
      font-size: 18px;
      cursor: url('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/pointer.png'), auto;
    }
  }
  .structure-content {
    height: 0;
    flex: 1;
    padding: 0;
    &-scroll {
      overflow-y: scroll;
      height: 100%;
    }
  }
}
</style>
