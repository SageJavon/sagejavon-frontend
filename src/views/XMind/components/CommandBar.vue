<script>
import { storeToRefs } from 'pinia'
import { defineComponent, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { resetcutKeydown, shortcutKeydown } from '../shortcutKey'
import { xmindMap } from '@/store'

export default defineComponent({
  props: {
    scaleNumber: Number,
  },
  setup(_, context) {
    const store = xmindMap()
    const { openThumb, readOnly, immersion } = storeToRefs(store)

    function setXMindMapCenter() {
      context.emit('set-map-center')
    }

    setXMindMapCenter()

    function requestFullScreen() {
      const element = document.getElementById('app')
      element.webkitRequestFullScreen()
      immersion.value = true
      readOnly.value = true
    }

    function exitFullScreen() {
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
      if (screen.height !== clientHeight) {
        immersion.value = false
        readOnly.value = false
      }
    }

    function resetXmindStyle() {
      context.emit('reset-xmind-style')
    }

    function setMindScale(command) {
      context.emit('set-scale', command)
    }

    onMounted(() => {
      window.addEventListener('resize', exitFullScreen)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', exitFullScreen)
    })

    watch(() => openThumb.value, (newVal) => {
      localStorage.setItem('openThumb', Number(newVal))
    })

    watch(() => readOnly.value, (newVal) => {
      localStorage.setItem('readOnly', Number(newVal))
      nextTick(() => {
        if (newVal)
          return resetcutKeydown()

        shortcutKeydown()
      })
    }, { immediate: true })

    return {
      openThumb,
      readOnly,
      setMindScale,
      resetXmindStyle,
      setXMindMapCenter,
      requestFullScreen,
    }
  },
})
</script>

<template>
  <div class="xmind-command-bar">
    <div class="bar-item">
      <a-checkbox v-model:checked="openThumb">
        缩略图
      </a-checkbox>
    </div>
    <div class="bar-item">
      <p :class="{ 'hight-light': !readOnly }">
        编辑模式
      </p>
      <a-switch v-model:checked="readOnly" size="small" />
      <p :class="{ 'hight-light': readOnly }">
        只读模式
      </p>
    </div>
    <div class="bar-item scale">
      <i class="icon ri-subtract-line" @click="setMindScale('reduce')" />
      <span>{{ scaleNumber }}%</span>
      <i class="icon ri-add-fill" @click="setMindScale('add')" />
    </div>
    <div class="bar-item">
      <a-tooltip
        :overlay-style="{ fontSize: '12px' }"
        placement="leftBottom"
        arrow-point-at-center
      >
        <template #title>
          <span>画布局中</span>
        </template>
        <i class="icon ri-focus-3-line" @click="setXMindMapCenter" />
      </a-tooltip>
    </div>
    <div class="bar-item">
      <a-tooltip
        :overlay-style="{ fontSize: '12px' }"
        placement="leftBottom"
        arrow-point-at-center
      >
        <template #title>
          <span>全屏只读模式查看</span>
        </template>
        <i class="icon ri-drag-move-line" @click="requestFullScreen" />
      </a-tooltip>
    </div>
    <div class="bar-item">
      <a-tooltip
        :overlay-style="{ fontSize: '12px' }"
        placement="leftBottom"
        arrow-point-at-center
      >
        <template #title>
          <span>重置画布节点样式</span>
        </template>
        <i class="icon ri-format-clear" @click="resetXmindStyle" />
      </a-tooltip>
    </div>
  </div>
</template>

<style lang="less">
.xmind-command-bar {
  position: fixed;
  right: 10px;
  top: 10px;
  box-shadow: 0px 0px 18px 5px rgba(0,0,0,0.1);
  background: #fff;
  border-radius: 4px;
  padding: 12px;
  z-index: 9;
  display: flex;
  align-items: center;
  user-select: none;
  .bar-item {
    padding: 0 8px;
    display: flex;
    align-items: center;
    &.scale {
      .icon {
        font-size: 20px;
        color: #4c4c4c;
      }
      span {
        font-size: 12px;
        font-family: revert;
        width: 40px;
        display: inline-block;
        text-align: center;
      }
    }
    .icon {
      font-size: 18px;
      cursor: url('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java%2Fpointer.png'), auto;
      transition: .3s;
      &:active {
        opacity: .6;
      }
    }
    p, span {
      font-size: 12px;
      color: #4c4c4c;
      &.could-click {
        cursor: url('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/pointer.png'), auto;
        color: #2080f7;
        transition: .3s;
        &:active {
          opacity: .6;
        }
      }
      &.hight-light {
        color: #2080f7
      }
    }
    .ant-switch {
      margin: 0 6px;
    }
  }
}
</style>
