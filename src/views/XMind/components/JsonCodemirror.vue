<template>
  <codemirror
    class="json-code-mirror"
    v-model="jsCode"
    disabled
    :extensions="extensions"
    :style="{ height: '100%' }"
    :line-numbers="false"
    readOnly
    :indent-with-tab="true"></codemirror>
</template>

<script>
import { Codemirror } from 'vue-codemirror'
import { ref, defineComponent, watch } from 'vue'
import { oneDark } from '@codemirror/theme-one-dark'
import { json } from '@codemirror/lang-json'
export default defineComponent({
  name: 'JsonCodemirror',
  props: {
    code: String
  },
  components: {
    Codemirror
  },
  setup (props) {
    const jsCode = ref(JSON.stringify(JSON.parse(props.code), null, 2))
    const extensions = [json(), oneDark]
    watch(() => props.code, () => {
      jsCode.value = JSON.stringify(JSON.parse(props.code), null, 2)
    })

    return {
      jsCode,
      extensions
    }
  }
})
</script>

<style lang="less">
.json-code-mirror {
  .cm-scroller {
    overflow: scroll;
    &::-webkit-scrollbar {
      width: 6px;
      height: 0;
    }
    .cm-line {
      caret-color: transparent !important;
      line-height: 26px;
      font-family: consola;
      font-size: 12px;
    }
    .cm-gutters {
      display: none !important;
    }
  }
}
</style>
