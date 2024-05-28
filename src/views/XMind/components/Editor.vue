<template>
  <div
    class="mind-mapbox-editor-block"
    :style="editorStyle.c1"
    :class="{ 'custom-position' : position }">
    <div
      :style="editorStyle.c2"
      ref="mindContentEditable"
      contenteditable
      @keydown="textAreaKeydown"
      class="mind-mapbox-contenteditable">{{ value }}</div>
    <transition name="tip-fade-in">
      <div v-show="tipVisible" class="tip-message">* 输入的超链接URL格式不正确</div>
    </transition>
  </div>
</template>

<script>

import { computed, ref, defineComponent, nextTick, watch, onBeforeUnmount } from 'vue'
import { resetcutKeydown, shortcutKeydown } from '../shortcutKey'

const placeHolderNameMap = {
  text: '请输入主题名称',
  link: '请输入主题超链接URL（以https://或者http://开头）',
  tag: '请输入主题标签名（多个标签用;隔开）',
  summary: '请输入主题概要信息',
  relation: '请输入主题之间的关系'
}
export default defineComponent({
  props: {
    value: {
      type: String,
      default: ''
    },
    editorTypeName: String,
    position: {
      type: Object,
      default: null
    }
  },
  setup (props, context) {
    const tipVisible = ref(false)
    const mindContentEditable = ref(null)
    nextTick(updatePlaceholder)
    resetcutKeydown()
    function textAreaKeydown (event) {
      if (event.keyCode === 13) {
        event.preventDefault()
        event.stopPropagation()
        const editValue = event.target.innerText.replace(/(^\s*)|(\s*$)/g, '')
        if (props.editorTypeName === 'link') {
          const reg = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i')
          if (!reg.test(editValue)) {
            return (tipVisible.value = true)
          }
          tipVisible.value = false
        }
        context.emit('set-editable-value', editValue, props.editorTypeName)
        return false
      }
    }

    function updatePlaceholder () {
      const placeholderName = placeHolderNameMap[props.editorTypeName]
      document.styleSheets[0].addRule('.mind-mapbox-contenteditable:empty::before', 'content: "' + `${placeholderName}` + '"')
      setContentSelectPos()
    }

    function setContentSelectPos () {
      const ele = document.querySelector('.mind-mapbox-contenteditable')
      const selection = window.getSelection()
      const range = document.createRange()
      if (!props.value.length) {
        range.selectNodeContents(ele)
        range.collapse(false)
      } else {
        range.setStart(ele.firstChild, 0)
        range.setEnd(ele.firstChild, props.value.length)
      }
      selection.removeAllRanges()
      selection.addRange(range)
    }

    watch(() => props.editorTypeName, () => {
      nextTick(updatePlaceholder)
    })

    const editorStyle = computed(() => {
      if (props.position) {
        const { top, left, height } = props.position
        return {
          c1: {
            top: `${top - 8}px`,
            left: `${left}px`,
            borderRadius: 0,
            minHeight: `${height + 8}px`,
            maxWidth: '300px',
            height: 'auto',
            lineHeight: 'inherit',
            padding: '8px'
          },
          c2: {
            marginTop: 0,
            minWidth: 'auto',
            maxWidth: 'auto'
          }
        }
      }
      return {}
    })

    onBeforeUnmount(() => {
      shortcutKeydown()
    })

    return {
      tipVisible,
      mindContentEditable,
      editorStyle,
      textAreaKeydown
    }
  }
})
</script>

<style lang="less" scoped>
.mind-mapbox-editor-block {
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: #fff;
  box-shadow: 0px 0px 18px 5px rgba(0,0,0,0.1);
  border-radius: 2px;
  min-height: 42px;
  line-height: 42px;
  padding: 0 12px;
  &.custom-position {
    padding: 0 8px;
    transform: translateX(0);
  }
  .mind-mapbox-contenteditable {
    color: #4c4c4c;
    font-size: 14px;
    outline: none;
    min-width: 360px;
    max-width: 420px;
    display: inline-block;
    margin-top: 12px;
    white-space: pre-wrap;
    word-break: break-all;
    line-break: anywhere;
    &:empty:before{
      color: 999;
      font-size: 12px;
    }
  }
  .tip-message {
    padding: 0 15px 8px;
    font-size: 12px;
    color: #ff0000;
  }
}

.tip-fade-in-enter-active, .tip-fade-in-leave-active {
  transition: 0.3s linear;
  opacity: 1;
  transform: translateY(0px);
}
.tip-fade-in-enter-from,
.tip-fade-in-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
