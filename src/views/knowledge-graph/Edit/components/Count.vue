<template>
  <div class="countContainer" :class="{ isDark: isDark }">
    <div class="item">
      <span class="name">总字数</span>
      <span class="value">{{ words }}</span>
    </div>
    <div class="item">
      <span class="name">总节点数</span>
      <span class="value">{{ num }}</span>
    </div>
  </div>
</template>

<script>
import bus from '@/utils/bus.js'
import { mapState } from 'vuex'
/**
 * 
 * @Desc: 字数及节点数量统计
 */
let countEl = document.createElement('div')
export default {
  name: 'Count',
  props: {
    mindMap: {
      type: Object
    }
  },
  data() {
    return {
      textStr: '',
      words: 0,
      num: 0
    }
  },
  computed: {
    ...mapState(['isDark'])
  },
  created() {
    bus.on('data_change', this.onDataChange)
    if (this.mindMap) {
      this.onDataChange(this.mindMap.getData())
    }
  },
  beforeDestroy() {
    bus.off('data_change', this.onDataChange)
  },
  methods: {
    /**
     * 
     * @Desc: 监听数据变化
     */
    onDataChange(data) {
      this.textStr = ''
      this.words = 0
      this.num = 0
      this.walk(data)
      countEl.innerHTML = this.textStr
      this.words = countEl.textContent.length
    },
    /**
     * 
     * @Desc: 遍历
     */
    walk(data) {
      this.num++
      this.textStr += String(data.data.text) || ''
      if (data.children && data.children.length > 0) {
        data.children.forEach(item => {
          this.walk(item)
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.countContainer {
  padding: 0 12px;
  position: fixed;
  left: 20px;
  bottom: 20px;
  background: hsla(0, 0%, 100%, 0.8);
  border-radius: 2px;
  opacity: 0.8;
  height: 22px;
  line-height: 22px;
  font-size: 12px;
  display: flex;
  &.isDark {
    background: #262a2e;
    .item {
      color: hsla(0, 0%, 100%, 0.6);
    }
  }

  .item {
    color: #555;
    margin-right: 15px;

    &:last-of-type {
      margin-right: 0;
    }

    .name {
      margin-right: 5px;
    }
  }
}
@media screen and (max-width: 740px) {
  .countContainer {
    display: none;
  }
}
</style>
