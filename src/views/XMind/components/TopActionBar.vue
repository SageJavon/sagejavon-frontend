<script>
import { computed, defineComponent } from 'vue'
export default defineComponent({
  props: {
    nodeId: {
      type: String,
      default: '',
    },
    historyStep: {
      type: Array,
      default: () => [],
    },
    currentStep: {
      type: Number,
      default: 0,
    },
    batchNodes: {
      type: Array,
      default: () => [],
    },
    isRoot: Boolean,
    structure: String,
  },
  setup(props, context) {
    const leftActionBars = computed(() => {
      return [
        {
          name: '上一步',
          icon: 'ri-reply-line',
          action: 'prev-step',
          disabled: !(props.historyStep.length > 1
            && props.currentStep < props.historyStep.length - 1),
        },
        {
          name: '下一步',
          icon: 'ri-share-forward-line',
          action: 'next-step',
          disabled: props.currentStep < 1,
        },
        {
          name: '主题',
          icon: 'ri-flow-chart',
          action: 'insert-brother',
          disabled: !props.nodeId || props.isRoot,
        },
        {
          name: '子主题',
          icon: 'ri-node-tree',
          action: 'insert-child',
          disabled: !props.nodeId,
        },
        {
          name: '标记',
          icon: 'ri-star-line',
          action: 'insert-marker',
          disabled: !props.nodeId,
        },
        {
          name: '概要',
          icon: 'icon-gaiyao',
          action: 'insert-summary',
          disabled: !props.nodeId || props.isRoot || props.structure === 'zzjgt',
          svgIcon: true,
        },
        {
          name: '关系',
          icon: 'ri-guide-line',
          action: 'insert-relation',
          disabled: !props.nodeId,
        },
        {
          name: '插入元素',
          icon: 'ri-play-list-add-line',
          disabled: false,
          action: 'export',
          list: [
            { name: '图片', action: 'insert-tupian', disabled: !props.nodeId },
            { name: '标签', action: 'insert-tag', disabled: !props.nodeId },
            { name: '超链接', action: 'insert-link', disabled: !props.nodeId },
            { name: '备注', action: 'insert-beizhu', disabled: !props.nodeId },
          ],
        },
        {
          name: '画布导出',
          icon: 'ri-folder-download-line',
          disabled: false,
          action: 'export',
          list: [
            { name: '.SVG', action: 'export-svg' },
            { name: '.PNG', action: 'export-png' },
            { name: '.JSON', action: 'export-json' },
          ],
        },
        {
          name: 'JSON导入',
          icon: 'ri-upload-cloud-line',
          action: 'import-json',
          disabled: false,
        },
        {
          name: '大纲',
          icon: 'ri-menu-fold-line',
          action: 'dagang',
          disabled: false,
        },
      ]
    })

    function handlerClick(iconItem) {
      if (iconItem.disabled)
        return
      context.emit('h-click', iconItem.action)
    }

    return {
      leftActionBars,
      handlerClick,
    }
  },
})
</script>

<template>
  <div class="xmind-context-top-actionbar">
    <div class="actionbar">
      <div
        v-for="item in leftActionBars"
        :key="item.action"
        :class="{ x_disabled: item.disabled }"
        class="toolbar-btn"
        @click="handlerClick(item)"
      >
        <div v-if="!item.list">
          <span v-if="!item.svgIcon" :class="`iconfont ${item.icon}`" />
          <p v-else class="svg-block" style="width: 40px;height: 28px;">
            <svg class="svg-block-icon" aria-hidden="true">
              <use :xlink:href="`#${item.icon}`" />
            </svg>
          </p>
        </div>
        <a-dropdown v-else placement="bottom" overlay-class-name="top-action-dropdown">
          <div>
            <span :class="`iconfont ${item.icon}`" />
            <i class="ri-arrow-down-s-fill" />
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item v-for="itemName in item.list" :key="itemName.action">
                <a
                  :class="{ disabled: itemName.disabled }"
                  href="javascript:;"
                  style="font-size: 12px;"
                  @click="handlerClick(itemName)"
                >{{ itemName.name }}</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <p>{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.xmind-context-top-actionbar {
  position: fixed;
  top: 10px;
  left: 10px;
  .actionbar {
    display: flex;
    background-color: #fff;
    padding: 10px 20px;
    border-radius: 6px;
    box-shadow: 0 2px 16px 0 rgba(0,0,0,.06);
    border: 1px solid rgba(0,0,0,0.06);
    margin-right: 20px;
    flex-shrink: 0;
    .toolbar-btn {
      text-align: center;
      cursor: url('https://heart-field-1312908194.cos.ap-shanghai.myqcloud.com/java/pointer.png'), auto;
      position: relative;
      margin: 0 8px;
      transition: .18s;
      user-select: none;
      .svg-block {
        width: 40px;
        height: 28px;
        margin-top: 0;
        text-align: center;
        border-radius: 4px;
        border: 1px solid rgba(0,0,0,0.35);
        &-icon {
          width: 22px;
          height: 22px;
          vertical-align: -0.15em;
          fill: currentColor;
          overflow: hidden;
          margin-top: 2px;
        }
      }
      &:not(.x_disabled):active {
        opacity: .5;
      }
      &.x_disabled {
        opacity: .6;
        cursor: not-allowed;
      }
      span {
        font-size: 18px;
        color: #000;
        border: 1px solid rgba(0,0,0,0.35);
        display: block;
        border-radius: 4px;
        padding: 4px;
      }
      .ri-arrow-down-s-fill {
        position: absolute;
        top: 7px;
        right: 0px;
      }
      p {
        font-size: 12px;
        color: #4c4c4c;
        margin-top: 6px;
        min-width: 40px;
      }
    }
  }
}
</style>

<style lang="less">
.top-action-dropdown {
  .ant-dropdown-menu {
    li {
      a {
        &.disabled {
          color: #999;
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>
