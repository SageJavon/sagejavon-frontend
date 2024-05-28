<template>
  <div
    :class="`tip-tap-editor tip-tap-editor-${placement}`"
    :style="{ left: `${left}px`, top: `${top}px` }">
    <Toolbar
      style="border-bottom: 1px solid #f1f1f1"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 310px; overflow-y: hidden;"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
    />
    <a-button v-show="!readOnly" type="primary" @click="setComment">保 存</a-button>
  </div>
</template>

<script>
import { xmindMap } from '@/store'
import { storeToRefs } from 'pinia'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { resetcutKeydown, shortcutKeydown } from '../shortcutKey'
import { defineComponent, onBeforeUnmount, ref, shallowRef, watch } from 'vue'

export default defineComponent({
  components: { Editor, Toolbar },
  props: {
    top: {
      type: Number,
      default: 20
    },
    left: {
      type: Number,
      default: 20
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    value: String
  },
  setup (props, context) {
    const store = xmindMap()
    const { readOnly } = storeToRefs(store)
    resetcutKeydown()
    const valueHtml = ref(props.value)
    const editorRef = shallowRef(null)
    const toolbarConfig = {
      toolbarKeys: ['bold', 'underline', 'color', 'italic', 'bulletedList', 'numberedList', 'todo', 'justifyLeft', 'justifyCenter', 'justifyRight']
    }
    const editorConfig = {
      placeholder: '请输入备注信息',
      autoFocus: true,
      readOnly: readOnly.value
    }

    function handleCreated (editor) {
      editorRef.value = editor
    }

    function setComment () {
      context.emit('get-comment-html', valueHtml.value)
    }

    watch(() => readOnly.value, newVal => {
      if (newVal && editorRef.value) {
        editorRef.value.disable()
      } else {
        editorRef.value.enable()
      }
    })

    onBeforeUnmount(() => {
      if (!editorRef.value) return
      editorRef.value.destroy()
      shortcutKeydown()
    })

    return {
      editorRef,
      valueHtml,
      mode: 'simple',
      toolbarConfig,
      editorConfig,
      readOnly,
      handleCreated,
      setComment
    }
  }
})
</script>

<style lang="less">
.tip-tap-editor {
  border: 1px solid #f1f1f1;
  width: 460px;
  box-shadow: 0 0 12px 0 rgba(0,0,0,0.1);
  position: fixed;
  z-index: 1200;
  transform: translateX(-50%);
  border-radius: 2px;
  .ant-btn {
    position: absolute;
    top: 2px;
    right: 2px;
    height: 28px;
    line-height: 1;
    padding: 0 16px;
    span {
      font-size: 12px;
    }
  }
  &::before {
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    border-top: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #b09f9f1a;
    border-left: 8px solid transparent;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
  }
  &::after {
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    border-top: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #fff;
    border-left: 6px solid transparent;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
  }
  .w-e-toolbar {
    .w-e-bar-item {
      height: auto;
      width: auto;
      padding: 2px;
      button {
        padding: 0 8px;
        font-size: 12px;
        height: 28px;
        svg {
          width: 12px;
          height: 12px;
        }
      }
    }
  }
  .w-e-text-container {
    padding: 4px;
    .w-e-scroll {
      p {
        margin: 8px 0;
      }
      input[type='radio'], input[type='checkbox'] {
        position: relative;
        top: 2px;
      }
    }
    .w-e-text-placeholder {
      left: 20px;
      top: 14px;
      font-style: normal;
      letter-spacing: 1px;
      color: #999;
    }
  }
}
</style>
