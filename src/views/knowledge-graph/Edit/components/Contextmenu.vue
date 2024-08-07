mind<template>
  <div class="contextmenuContainer listBox" v-if="isShow" :style="{ left: left + 'px', top: top + 'px' }" :class="{ isDark: isDark }">
    <template v-if="type === 'node'">
      <div class="item" @click="exec('INSERT_NODE', insertNodeBtnDisabled)" :class="{ disabled: insertNodeBtnDisabled }">
        <span class="name">插入同级节点</span>
        <span class="desc">Enter</span>
      </div>
      <div class="item" @click="exec('INSERT_CHILD_NODE')" :class="{ disabled: isGeneralization }">
        <span class="name">插入子节点</span>
        <span class="desc">Tab</span>
      </div>
      <div class="item" @click="exec('INSERT_PARENT_NODE')" :class="{ disabled: insertNodeBtnDisabled }">
        <span class="name">插入父节点</span>
        <span class="desc">Shift + Tab</span>
      </div>
      <div class="item" @click="exec('ADD_GENERALIZATION')" :class="{ disabled: insertNodeBtnDisabled }">
        <span class="name">插入总结</span>
        <span class="desc">Ctrl + G</span>
      </div>
      <div class="item" @click="exec('UP_NODE')" :class="{ disabled: upNodeBtnDisabled }">
        <span class="name">向上移动</span>
        <span class="desc">Ctrl + ↑</span>
      </div>
      <div class="item" @click="exec('DOWN_NODE')" :class="{ disabled: downNodeBtnDisabled }">
        <span class="name">向下移动</span>
        <span class="desc">Ctrl + ↓</span>
      </div>
      <div class="item danger" @click="exec('REMOVE_NODE')">
        <span class="name">删除</span>
        <span class="desc">Delete</span>
      </div>
      <div class="item danger" @click="exec('REMOVE_CURRENT_NODE')">
        <span class="name">删除当前节点</span>
        <span class="desc">Shift + Backspace</span>
      </div>
      <div class="item" @click="exec('COPY_NODE')" :class="{ disabled: isGeneralization }">
        <span class="name">复制</span>
        <span class="desc">Ctrl + C</span>
      </div>
      <div class="item" @click="exec('CUT_NODE')" :class="{ disabled: isGeneralization }">
        <span class="name">剪切</span>
        <span class="desc">Ctrl + X</span>
      </div>
      <div class="item" @click="exec('PASTE_NODE')">
        <span class="name">粘贴</span>
        <span class="desc">Ctrl + V</span>
      </div>
      <div class="item" @click="exec('REMOVE_HYPERLINK')" v-if="hasHyperlink">
        <span class="name">移除超链接</span>
      </div>
      <div class="item" @click="exec('REMOVE_NOTE')" v-if="hasNote">
        <span class="name">移除笔记</span>
      </div>
    </template>
    <template v-if="type === 'svg'">
      <div class="item" @click="exec('RETURN_CENTER')">
        <span class="name">回到中心</span>
        <span class="desc">Ctrl + Enter</span>
      </div>
      <div class="item" @click="exec('EXPAND_ALL')">
        <span class="name">展开全部</span>
      </div>
      <div class="item" @click="exec('UNEXPAND_ALL')">
        <span class="name">收起全部</span>
      </div>
      <div class="item">
        <span class="name">展开到..</span>
        <div class="subItems listBox" :class="{ isDark: isDark }">
          <div class="item" v-for="(item, index) in expandList" :key="item" @click="exec('UNEXPAND_TO_LEVEL', false, index + 1)">
            {{ item }}
          </div>
        </div>
      </div>
      <div class="item" @click="exec('RESET_LAYOUT')">
        <span class="name">{{ $t('contextmenu.arrangeLayout') }}</span>
        <span class="desc">Ctrl + L</span>
      </div>
      <div class="item" @click="exec('FIT_CANVAS')">
        <span class="name">适应画布</span>
        <span class="desc">Ctrl + i</span>
      </div>
      <div class="item" @click="exec('TOGGLE_ZEN_MODE')">
        <span class="name">只读模式</span>
        {{ isZenMode ? '√' : '' }}
      </div>
    </template>
  </div>
</template>

<script>
import bus from '@/utils/bus.js'
import { mapState, mapMutations } from 'vuex'

/**
 * 
 * @Desc: 右键菜单
 */
export default {
  name: 'Contextmenu',
  props: {
    mindMap: {
      type: Object
    }
  },
  data() {
    return {
      isShow: false,
      left: 0,
      top: 0,
      node: null,
      type: '',
      isMousedown: false,
      mosuedownX: 0,
      mosuedownY: 0
    }
  },
  computed: {
    ...mapState({
      isZenMode: state => state.localConfig.isZenMode,
      isDark: state => state.isDark
    }),
    expandList() {
      return [
        this.$t('contextmenu.level1'),
        this.$t('contextmenu.level2'),
        this.$t('contextmenu.level3'),
        this.$t('contextmenu.level4'),
        this.$t('contextmenu.level5'),
        this.$t('contextmenu.level6')
      ]
    },
    insertNodeBtnDisabled() {
      return !this.node || this.node.isRoot || this.node.isGeneralization
    },
    upNodeBtnDisabled() {
      if (!this.node || this.node.isRoot || this.node.isGeneralization) {
        return true
      }
      let isFirst =
        this.node.parent.children.findIndex(item => {
          return item === this.node
        }) === 0
      return isFirst
    },
    downNodeBtnDisabled() {
      if (!this.node || this.node.isRoot || this.node.isGeneralization) {
        return true
      }
      let children = this.node.parent.children
      let isLast =
        children.findIndex(item => {
          return item === this.node
        }) ===
        children.length - 1
      return isLast
    },
    isGeneralization() {
      return this.node.isGeneralization
    },
    hasHyperlink() {
      return !!this.node.getData('hyperlink')
    },
    hasNote() {
      return !!this.node.getData('note')
    }
  },
  created() {
    bus.on('node_contextmenu', this.show)
    bus.on('node_click', this.hide)
    bus.on('draw_click', this.hide)
    bus.on('expand_btn_click', this.hide)
    bus.on('svg_mousedown', this.onMousedown)
    bus.on('mouseup', this.onMouseup)
  },
  beforeDestroy() {
    bus.off('node_contextmenu', this.show)
    bus.off('node_click', this.hide)
    bus.off('draw_click', this.hide)
    bus.off('expand_btn_click', this.hide)
    bus.off('svg_mousedown', this.onMousedown)
    bus.off('mouseup', this.onMouseup)
  },
  methods: {
    ...mapMutations(['setLocalConfig']),
    /**
     * 
     * @Desc: 节点右键显示
     */
    // mitt只能传一个参数
    show([e, node]) {
      this.type = 'node'
      this.left = e.clientX + 10
      this.top = e.clientY + 10
      this.isShow = true
      this.node = node
    },

    /**
     * 
     * @Desc: 鼠标按下事件
     */
    onMousedown(e) {
      if (e.which !== 3) {
        return
      }
      this.mosuedownX = e.clientX
      this.mosuedownY = e.clientY
      this.isMousedown = true
    },

    /**
     * 
     * @Desc: 鼠标松开事件
     */
    onMouseup(e) {
      if (!this.isMousedown) {
        return
      }
      this.isMousedown = false
      if (Math.abs(this.mosuedownX - e.clientX) > 3 || Math.abs(this.mosuedownY - e.clientY) > 3) {
        this.hide()
        return
      }
      this.show2(e)
    },

    /**
     * 
     * @Desc: 画布右键显示
     */
    show2(e) {
      this.type = 'svg'
      this.left = e.clientX + 10
      this.top = e.clientY + 10
      this.isShow = true
    },

    /**
     * 
     * @Desc: 隐藏
     */
    hide() {
      this.isShow = false
      this.left = 0
      this.top = 0
      this.type = ''
    },

    /**
     * 
     * @Desc: 执行命令
     */
    exec(key, disabled, ...args) {
      if (disabled) {
        return
      }
      switch (key) {
        case 'COPY_NODE':
          this.mindMap.renderer.copy()
          break
        case 'CUT_NODE':
          this.mindMap.renderer.cut()
          break
        case 'PASTE_NODE':
          this.mindMap.renderer.paste()
          break
        case 'RETURN_CENTER':
          this.mindMap.renderer.setRootNodeCenter()
          break
        case 'TOGGLE_ZEN_MODE':
          this.setLocalConfig({
            isZenMode: !this.isZenMode
          })
          break
        case 'FIT_CANVAS':
          this.mindMap.view.fit()
          break
        case 'REMOVE_HYPERLINK':
          this.node.setHyperlink('', '')
          break
        case 'REMOVE_NOTE':
          this.node.setNote('')
          break
        default:
          bus.emit('execCommand', [key, ...args])
          break
      }
      this.hide()
    }
  }
}
</script>

<style lang="less" scoped>
.listBox {
  width: 260px;
  background: #fff;
  box-shadow: 0 4px 12px 0 hsla(0, 0%, 69%, 0.5);
  border-radius: 4px;
  padding-top: 16px;
  padding-bottom: 16px;
  &.isDark {
    background: #363b3f;
  }
}

.contextmenuContainer {
  position: fixed;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #1a1a1a;
  &.isDark {
    color: #fff;
    .item {
      &:hover {
        background: hsla(0, 0%, 100%, 0.05);
      }
    }
  }

  .item {
    position: relative;
    height: 28px;
    line-height: 28px;
    padding: 0 16px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;

    &.danger {
      color: #f56c6c;
    }

    &:hover {
      background: #f5f5f5;

      .subItems {
        visibility: visible;
      }
    }

    &.disabled {
      color: grey;
      cursor: not-allowed;
      pointer-events: none;

      &:hover {
        background: #fff;
      }
    }

    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .desc {
      color: #999;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .subItems {
      position: absolute;
      left: 100%;
      top: 0;
      visibility: hidden;
    }
  }
}
</style>
